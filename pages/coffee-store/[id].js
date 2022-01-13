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
  const paths = coffeeStoresData.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.id.toString()
      }
    }
  })
  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = (props) => {
  const router = useRouter();

  if(router.isFallback) {
    return <div>Loading...</div>
  }

  const {address, name, neighbourhood,imgUrl} = props.coffeeStore;

  console.log("props: ",props);

  return (
    <div>
      <Head>
        <title>{name}</title>
        <link rel="icon" href={imgUrl} />
      </Head>
      <Link href="/">
        <a>Back to Home</a>
      </Link>
      <p>{address}</p>
      <p>{name}</p>
      <p>{neighbourhood}</p>
    </div>
  );
};

export default CoffeeStore;
