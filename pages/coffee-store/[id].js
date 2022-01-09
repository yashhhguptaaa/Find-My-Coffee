import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

const CoffeeStore = (query) => {
  const router = useRouter().query.id;

  return (
    <div>
      <Head>
          <title>{router}</title>
      </Head>
      Coffee Store Page {router}
      <Link href="/">
        <a>Back to Home</a>
      </Link>
    </div>
  );
};

export default CoffeeStore;
 