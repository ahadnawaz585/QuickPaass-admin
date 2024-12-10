import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
// import CompanyService from "@/frontend/services/company.service";
// import { environment } from "@/environment/environment";

const Logo = () => {
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching logo data
    const fetchLogo = async () => {
      try {
        // Uncomment and use this when integrating with the actual service
        // const logoData = await companyService.getCompanyLogo();
        // if (logoData?.logoPath) {
        //   setLogo(`${environment.apiUrl}${logoData.logoPath}`);
        // } else {
        //   setLogo(null);
        // }

        // Mock logo URL for now
        setLogo("/logo.png"); // Replace with your dynamic logic
      } catch (error) {
        console.error("Error fetching logo:", error);
        setLogo(null);
      }
    };

    fetchLogo();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <Link href="/analytics">
      {logo && logo.endsWith(".svg") ? (
        <img
          src={logo}
          loading="lazy"
          alt="Company Logo"
          style={{ width: "100px", height: "50px" }}
        />
      ) : (
        <Image
          alt="Default Logo"
          height={10}
          width={50}
          priority={false}
          className="cursor-pointer"
          src={logo || "/logo.png"} // Fallback to default logo
        />
      )}
    </Link>
  );
};

export default Logo;
