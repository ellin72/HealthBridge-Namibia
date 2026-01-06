export declare function patientToFHIR(patient: any): {
    resourceType: string;
    id: any;
    identifier: {
        use: string;
        value: any;
    }[];
    name: {
        use: string;
        family: any;
        given: any[];
    }[];
    telecom: {
        system: string;
        value: any;
    }[];
    gender: any;
    birthDate: any;
    meta: {
        lastUpdated: any;
    };
};
export declare function appointmentToFHIR(appointment: any): {
    resourceType: string;
    id: any;
    status: string;
    serviceType: {
        coding: {
            system: string;
            code: string;
            display: string;
        }[];
    }[];
    participant: {
        actor: {
            reference: string;
        };
        status: string;
    }[];
    start: any;
    end: string;
    created: any;
    meta: {
        lastUpdated: any;
    };
};
export declare function observationToFHIR(observation: any): {
    resourceType: string;
    id: any;
    status: string;
    category: {
        coding: {
            system: string;
            code: any;
        }[];
    }[];
    code: {
        coding: {
            system: any;
            code: any;
            display: any;
        }[];
    };
    subject: {
        reference: string;
    };
    effectiveDateTime: any;
    valueQuantity: {
        value: any;
        unit: any;
        system: string;
        code: any;
    } | undefined;
    valueString: any;
    meta: {
        lastUpdated: any;
    };
};
export declare function storeFHIRResource(resource: any): Promise<{
    id: string;
    createdAt: Date;
    resourceType: string;
    version: number;
    fhirId: string;
    resourceData: string;
    lastUpdated: Date;
}>;
export declare function getFHIRResource(fhirId: string): Promise<any>;
export declare function exportPatientAsFHIRBundle(patientId: string): Promise<{
    resourceType: string;
    type: string;
    id: string;
    timestamp: string;
    entry: ({
        fullUrl: string;
        resource: {
            resourceType: string;
            id: any;
            status: string;
            serviceType: {
                coding: {
                    system: string;
                    code: string;
                    display: string;
                }[];
            }[];
            participant: {
                actor: {
                    reference: string;
                };
                status: string;
            }[];
            start: any;
            end: string;
            created: any;
            meta: {
                lastUpdated: any;
            };
        };
    } | {
        fullUrl: string;
        resource: {
            resourceType: string;
            id: any;
            identifier: {
                use: string;
                value: any;
            }[];
            name: {
                use: string;
                family: any;
                given: any[];
            }[];
            telecom: {
                system: string;
                value: any;
            }[];
            gender: any;
            birthDate: any;
            meta: {
                lastUpdated: any;
            };
        };
    })[];
}>;
//# sourceMappingURL=fhir.d.ts.map