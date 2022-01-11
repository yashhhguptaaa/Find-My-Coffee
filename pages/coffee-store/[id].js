import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import coffeeStoresData from "../../data/coffee-stores.json";

export async function getStaticProps(staticProps) {
  console.log("staticProps:", staticProps);
  const params = staticProps.params;
  console.log("params:", params);
  return {
    props: {
      coffeeStore: coffeeStoresData.find((coffeeStore) => {
        return coffeeStore.id.toString() === params.id; //dynamic id
      }),
    },
  };
}

export function getStaticPaths() {
  return {
    paths: [{ params: { id: "0" } }, { params: { id: "1" } }],
    fallback: false,
  };
}

const CoffeeStore = (props) => {
  const router = useRouter().query.id;

  console.log("props: ",props);

  return (
    <div>
      <Head>
        <title>{router}</title>
      </Head>
      Coffee Store Page {router}
      <Link href="/">
        <a>Back to Home</a>
      </Link>
      <p>{props.coffeeStore.address}</p>
      <p>{props.coffeeStore.name}</p>
    </div>
  );
};

export default CoffeeStore;
