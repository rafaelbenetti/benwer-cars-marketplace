import { TenantHome, generateTenantMetadata } from "../(tenant)/TenantHome";

export const generateMetadata = generateTenantMetadata;

function TenantHomePage() {
  return <TenantHome />;
}

export default TenantHomePage;
