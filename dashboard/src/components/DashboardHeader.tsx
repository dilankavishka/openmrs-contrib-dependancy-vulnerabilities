import React from "react";

const DashboardHeader: React.FC = () => {
    return (
        <div style={{ marginBottom: "2rem" }}>
            <h1
                style={{
                    marginBottom: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                }}
            >
                OpenMRS Dependency Vulnerability Dashboard
            </h1>
            <div
                style={{
                    height: "4px",
                    width: "60px",
                    backgroundColor: "#005d5d",
                    marginBottom: "1rem",
                }}
            />
            <p style={{ color: "#525252" }}>
                A summary of known security vulnerabilities detected across
                OpenMRS modules by automated dependency scanning. Each module
                lists its vulnerable dependencies, severity levels, and
                recommended fix versions to help maintainers prioritize
                upgrades.
            </p>
        </div>
    );
};

export default DashboardHeader;
