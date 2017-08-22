import { ServiceEndpoint, ServiceEndpointResponse, ServiceEndpointNamespace } from "./lib/ServiceEndpoint";

const CreateServiceEndpoint = ServiceEndpoint.ServiceEndpointRoleClasses
    .CreateServiceEndpoint;
const ReadServiceEndpoint = ServiceEndpoint.ServiceEndpointRoleClasses
    .ReadServiceEndpoint;
const UpdateServiceEndpoint = ServiceEndpoint.ServiceEndpointRoleClasses
    .UpdateServiceEndpoint;
const DeleteServiceEndpoint = ServiceEndpoint.ServiceEndpointRoleClasses
    .DeleteServiceEndpoint;

export {
    CreateServiceEndpoint,
    ReadServiceEndpoint,
    UpdateServiceEndpoint,
    DeleteServiceEndpoint,
    ServiceEndpointResponse,
    ServiceEndpointNamespace
};