import { config } from "dotenv";

config();
const getBaseUrl = () => `${process.env.NEXT_PUBLIC_BASEURL}`;

export default getBaseUrl;
