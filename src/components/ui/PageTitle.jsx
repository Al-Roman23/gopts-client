import { Helmet } from "react-helmet-async";

const PageTitle = ({ title }) => {
  return (
    <Helmet>
      <title>{title ? `${title} | GOPTS` : "GOPTS | Garments Order & Production Tracker"}</title>
    </Helmet>
  );
};

export default PageTitle;
