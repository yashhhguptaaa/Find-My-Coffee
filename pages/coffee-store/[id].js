import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

import useSWR from "swr";

import styles from "../../styles/coffee-store.module.css";

import cls from "classnames";
import { fetchCoffeeStores } from "../../lib/coffee-stores";

import { StoreContext } from "../../store/store-context";
import { isEmpty } from "../../utils";

export async function getStaticProps(staticProps) {
  const params = staticProps.params;

  const coffeeStores = await fetchCoffeeStores();

  const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
    return coffeeStore.id === params.id; //dynamic id
  });
  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();

  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.id,
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = (initialProps) => {

  const router = useRouter();

  const id = router.query.id;

  const [LoadingCondition, setLoadingCondition] = useState(router.isFallback)

  

  const [votingCount, setVotingCount] = useState(0);
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);


  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);

      setVotingCount(data[0].voting);
    }
  }, [data]);

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
          return coffeeStore.id.toString() === id; //dynamic id
        });

        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      // SSG
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps, initialProps.coffeeStore]);


  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, voting, imgUrl, neighbourhood, address } = coffeeStore;
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          neighbourhood: Array.isArray(neighbourhood)
            ? neighbourhood.join(",")
            : neighbourhood,
          address: address ? address :"",
        }),
      });

      const dbCoffeeStore = await response.json();

      setCoffeeStore(dbCoffeeStore.records[0]);
      setVotingCount(dbCoffeeStore.records[0].voting);
    } catch (err) {
      console.error("Error creating coffee store", err);
    }
  };

  const handleUpvoteButton = async () => {
    try {
      const response = await fetch("/api/favouriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const dbCoffeeStore = await response.json();

      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        setVotingCount(dbCoffeeStore[0].voting);
      }
    } catch (err) {
      console.error("Error upvoting the coffee store", err);
    }
  };

  if (LoadingCondition) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Something went wrong retrieving coffee store page</div>;
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{coffeeStore.name}</title>
        <meta name="description" content= {`${coffeeStore.name} is the Coffee shop near you. They have some amazing coffee collection. You can drink your brew here.`} />
        <link rel="icon" href="/coffeeIcon.png" />
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>← Back to Home</a>
            </Link>
          </div>

          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{coffeeStore.name}</h1>
          </div>

          <Image
            src={
              coffeeStore.imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={coffeeStore.name}
          ></Image>
        </div>

        <div className={cls("glass", styles.col2)}>
          {coffeeStore.address && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/places.svg"
                width="24"
                height="24"
                alt={coffeeStore.address}
              />

              <p className={styles.text}>{coffeeStore.address}</p>
            </div>
          )}
          {coffeeStore.neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                width="24"
                height="24"
                alt={coffeeStore.neighbourhood}
              />
              <p className={styles.text}>{coffeeStore.neighbourhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt="Votes"
            />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
