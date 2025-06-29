import AddTenantCategory from "@/components/admin/tenants/category/addTenantCategory";
import TenantCategoryList from "@/components/admin/tenants/category/tenantCategoryList";

const TenantCategoryPage = () => {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 flex flex-col md:flex-row gap-6 items-start">
      <div className="flex-1 w-full bg-base-100 rounded shadow p-4">
        <TenantCategoryList />
      </div>
      <div className="w-full md:w-96 bg-base-100 rounded shadow p-4 max-h-screen overflow-y-auto">
        <AddTenantCategory />
      </div>
    </div>
  );
};
export default TenantCategoryPage;