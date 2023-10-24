/* eslint-disable @next/next/no-img-element */
import { paginationFetcher } from "@/services/backend/axiosClient";
import { $user } from "@/store/user";
import { PostInformation } from "@/types/Post";
import { useStore } from "@nanostores/react";
import useSWRInfinite from "swr/infinite";
import PostInput from "../PostInput/PostInput";
import PostCard from "@/components/PostCard/PostCard";
import { useWindowScroll } from "@mantine/hooks";
import { useEffect } from "react";

function getKey(pageNumber: number, previousPageData: PostInformation[]) {
  if (pageNumber && !previousPageData.length) return null; // reached the end
  return `/post?pageNumber=${
    pageNumber + 1
  }&pageSize=4&sortBy=id&sortDirection=DESC`; // SWR key
}

export default function PostTab() {
  const user = useStore($user);

  const { data, size, setSize, mutate } = useSWRInfinite(
    getKey,
    paginationFetcher<PostInformation>
  );

  const [scroll, scrollTo] = useWindowScroll();

  useEffect(() => {
    console.log(scroll, size, window.screen.height);

    if (scroll.y > window.screen.height * size) {
      setSize((prev) => prev + 1);
    }
  }, [scroll]);

  if (!user) return <></>;

  return (
    <div className="post-tab">
      <PostInput refreshFunc={mutate} />
      {data?.flat().map((item) => (
        <div key={item.id} className="my-10">
          <PostCard artist={user} postInformation={item} />
        </div>
      ))}
    </div>
  );
}
