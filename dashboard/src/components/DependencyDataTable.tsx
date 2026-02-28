import React from "react";
import {
    DataTable,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
    TableExpandHeader,
    TableExpandRow,
    TableExpandedRow,
} from "@carbon/react";
import { SeverityTag } from "./SeverityTag";
import { VulnerabilityTable } from "./VulnerabilityTable";
import type { VulnerableDependency } from "../types";

interface DependencyDataTableProps {
    dependencies: VulnerableDependency[];
}

const DependencyDataTable: React.FC<DependencyDataTableProps> = ({ dependencies }) => {
    const headers = [
        { key: "package", header: "Dependency" },
        { key: "currentVersion", header: "Version" },
        { key: "highestSeverity", header: "Severity", isSortable: true },
        { key: "cveCount", header: "CVEs" },
        { key: "isExploitable", header: "Exploit?" },
        { key: "recommendedFix", header: "Fix Version" },
    ];

    const rows = dependencies.map((dep) => ({
        ...dep,
        id: `${dep.package}@${dep.currentVersion}`,
        cveCount: dep.allCVEs.length,
        isExploitable: dep.isExploitable ? "Yes" : "-",
    }));

    return (
        <DataTable rows={rows} headers={headers}>
            {({ rows, headers, getHeaderProps, getTableProps, getRowProps }) => (
                <TableContainer>
                    <Table {...getTableProps()} size="lg">
                        <TableHead>
                            <TableRow>
                                <TableExpandHeader />
                                {headers.map((header) => (
                                    <TableHeader {...getHeaderProps({ header })}>
                                        {header.header}
                                    </TableHeader>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <React.Fragment key={row.id}>
                                    <TableExpandRow {...getRowProps({ row })}>
                                        {row.cells.map((cell) => (
                                            <TableCell key={cell.id}>
                                                {cell.info.header === "highestSeverity" ? (
                                                    <SeverityTag severity={cell.value} />
                                                ) : (
                                                    cell.value
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableExpandRow>
                                    <TableExpandedRow colSpan={headers.length + 1}>
                                        <div
                                            style={{
                                                padding: "1rem 0.5rem",
                                                backgroundColor: "#f4f4f4",
                                            }}
                                        >
                                            <VulnerabilityTable
                                                vulnerabilities={
                                                    dependencies.find(
                                                        (d) => `${d.package}@${d.currentVersion}` === row.id
                                                    )?.allCVEs || []
                                                }
                                            />
                                        </div>
                                    </TableExpandedRow>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </DataTable>
    );
};

export default DependencyDataTable;
