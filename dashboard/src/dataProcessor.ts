import { SeverityRating } from "./types";
import type {
  SeverityLevel,
  RawSecurityReport,
  RepositoryReport,
  VulnerableDependency,
  VulnerabilitySource,
  VulnerabilityDetail,
} from "./types";

const calculateNumericalScore = (severity: SeverityLevel): number => {
  const scores: Record<SeverityLevel, number> = {
    Critical: 10.0,
    High: 8.0,
    Medium: 5.0,
    Low: 2.0,
    Unknown: 0.0,
  };
  return scores[severity] || 0.0;
};

const findRecommendedFixVersion = (source: VulnerabilitySource): string => {
  const { description, links } = source;

  const fixMatch = description.match(/fixed in ([\d.]+)/i);
  if (fixMatch) return fixMatch[1];

  const releaseLink = links.find(
    (link) => link.url.includes("tag/v") || link.url.includes("releases/tag"),
  );

  if (releaseLink) {
    const tagMatch = releaseLink.url.match(/tag\/v?([\d.]+)/);
    if (tagMatch) return tagMatch[1];
  }
  return "-";
};

const extractCWE = (finding: VulnerabilitySource): string => {
  const cweMatch = finding.description.match(/CWE-\d+/i);
  if (cweMatch) return cweMatch[0].toUpperCase();

  const cweId = finding.identifiers?.find(
    (id) => id.type.toLowerCase() === "cwe",
  );
  return cweId ? cweId.name : "-";
};

const checkIfExploitable = (finding: VulnerabilitySource): boolean => {
  return finding.links.some(
    (link) =>
      link.name?.toUpperCase().includes("EXPLOIT") ||
      link.url.toUpperCase().includes("EXPLOIT"),
  );
};

const compareByDanger = (
  a: { severity: SeverityLevel; score: number; name: string },
  b: { severity: SeverityLevel; score: number; name: string },
): number => {
  if (SeverityRating[b.severity] !== SeverityRating[a.severity]) {
    return SeverityRating[b.severity] - SeverityRating[a.severity];
  }

  if (b.score !== a.score) {
    return b.score - a.score;
  }
  return a.name.localeCompare(b.name);
};

export const transformRawReportsToUIModel = (
  inputReports: { repoName: string; rawData: RawSecurityReport }[],
): RepositoryReport[] => {
  const processedReports: RepositoryReport[] = inputReports.map((input) => {
    const dependencyMap = new Map<string, VulnerableDependency>();

    input.rawData.vulnerabilities.forEach((finding) => {
      const { name: packageName } = finding.location.dependency.package;
      const { version: packageVersion } = finding.location.dependency;
      const groupKey = `${packageName}@${packageVersion}`;

      const cveDetail: VulnerabilityDetail = {
        id: finding.id,
        severity: finding.severity,
        score: calculateNumericalScore(finding.severity),
        description: finding.description,
        fixedIn: findRecommendedFixVersion(finding),
        cwe: extractCWE(finding),
        affectedVersions: `>= ${packageVersion}`,
        url: finding.identifiers?.[0]?.url || finding.links[0]?.url,
      };

      const isExploitable = checkIfExploitable(finding);

      if (!dependencyMap.has(groupKey)) {
        dependencyMap.set(groupKey, {
          package: packageName,
          currentVersion: packageVersion,
          highestSeverity: finding.severity,
          highestScore: cveDetail.score,
          allCVEs: [cveDetail],
          recommendedFix: cveDetail.fixedIn,
          isExploitable,
        });
      } else {
        const dep = dependencyMap.get(groupKey)!;

        if (!dep.allCVEs.some((cve) => cve.id === cveDetail.id)) {
          dep.allCVEs.push(cveDetail);
        }

        if (isExploitable) dep.isExploitable = true;

        if (
          SeverityRating[finding.severity] > SeverityRating[dep.highestSeverity]
        ) {
          dep.highestSeverity = finding.severity;
        }

        if (cveDetail.score > dep.highestScore) {
          dep.highestScore = cveDetail.score;
        }

        if (
          cveDetail.fixedIn !== "-" &&
          (dep.recommendedFix === "-" || cveDetail.fixedIn > dep.recommendedFix)
        ) {
          dep.recommendedFix = cveDetail.fixedIn;
        }
      }
    });

    const sortedDependencies = Array.from(dependencyMap.values())
      .map((dep) => ({
        ...dep,
        allCVEs: dep.allCVEs.sort((a, b) => b.score - a.score),
      }))
      .sort((a, b) =>
        compareByDanger(
          {
            severity: a.highestSeverity,
            score: a.highestScore,
            name: a.package,
          },
          {
            severity: b.highestSeverity,
            score: b.highestScore,
            name: b.package,
          },
        ),
      );

    const topDep = sortedDependencies[0];
    return {
      repoName: input.repoName,
      overallSeverity: topDep?.highestSeverity || "Low",
      maxScore: topDep?.highestScore || 0,
      vulnerableDependencies: sortedDependencies,
    };
  });

  return processedReports.sort((a, b) =>
    compareByDanger(
      { severity: a.overallSeverity, score: a.maxScore, name: a.repoName },
      { severity: b.overallSeverity, score: b.maxScore, name: b.repoName },
    ),
  );
};
