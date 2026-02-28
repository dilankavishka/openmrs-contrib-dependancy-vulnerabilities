import React, { useMemo } from "react";
import { Content, Accordion, AccordionItem, Grid, Column } from "@carbon/react";
import { SeverityTag } from "./components/SeverityTag";
import DashboardHeader from "./components/DashboardHeader";
import DependencyDataTable from "./components/DependencyDataTable";
import { transformRawReportsToUIModel } from "./dataProcessor";
import type { RawSecurityReport } from "./types";

import coreData from "./data/openmrs-core.json";
import billingData from "./data/openmrs-module-billing.json";
import idgenData from "./data/openmrs-module-idgen.json";

const App: React.FC = () => {
  const dashboardData = useMemo(() => {
    const rawReports = [
      {
        repoName: "openmrs-core",
        rawData: coreData as unknown as RawSecurityReport,
      },
      {
        repoName: "openmrs-module-billing",
        rawData: billingData as unknown as RawSecurityReport,
      },
      {
        repoName: "openmrs-module-idgen",
        rawData: idgenData as unknown as RawSecurityReport,
      },
    ];
    return transformRawReportsToUIModel(rawReports);
  }, []);

  return (
    <Content>
      <Grid fullWidth>
        <Column lg={16} md={8} sm={4}>
          <DashboardHeader />

          <Accordion align="start" size="lg">
            {dashboardData.map((report) => (
              <AccordionItem
                key={report.repoName}
                title={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{report.repoName}</span>
                    <SeverityTag severity={report.overallSeverity} />
                  </div>
                }
              >
                <div style={{ padding: "0 0 1.5rem 0" }}>
                  <DependencyDataTable
                    dependencies={report.vulnerableDependencies}
                  />
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </Column>
      </Grid>
    </Content>
  );
};

export default App;
