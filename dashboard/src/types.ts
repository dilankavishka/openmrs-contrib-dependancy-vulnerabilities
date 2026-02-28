export type SeverityLevel = "Critical" | "High" | "Medium" | "Low" | "Unknown";

export const SeverityRating: Record<SeverityLevel, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
  Unknown: 0,
};

export interface VulnerabilitySource {
  id: string;
  severity: SeverityLevel;
  name: string;
  description: string;
  location: {
    dependency: {
      package: { name: string };
      version: string;
    };
  };
  links: { name?: string; url: string }[];
  identifiers?: { type: string; name: string; value: string; url?: string }[];
}

export interface RawSecurityReport {
  vulnerabilities: VulnerabilitySource[];
}

export interface VulnerabilityDetail {
  id: string;
  severity: SeverityLevel;
  score: number;
  description: string;
  fixedIn: string;
  affectedVersions: string;
  cwe: string;
  url?: string;
}

export interface VulnerableDependency {
  package: string;
  currentVersion: string;
  highestSeverity: SeverityLevel;
  highestScore: number;
  allCVEs: VulnerabilityDetail[];
  recommendedFix: string;
  isExploitable: boolean;
}

export interface RepositoryReport {
  repoName: string;
  overallSeverity: SeverityLevel;
  maxScore: number;
  vulnerableDependencies: VulnerableDependency[];
}
