import PostCard from "@/components/PostCard/PostCard";
import { paginationFetcher } from "@/services/backend/axiosClient";
import { PostInformation } from "@/types/Post";
import { User } from "@/types/User";
import { useWindowScroll } from "@mantine/hooks";
import { useEffect } from "react";
import useSWRInfinite from "swr/infinite";

export default function PostContainer({ artist }: { artist: User }) {
  function getKey(pageNumber: number, previousPageData: PostInformation[]) {
    if (pageNumber && !previousPageData.length) return null; // reached the end
    return `/post?username=${artist.username}&pageNumber=${
      pageNumber + 1
    }&pageSize=4&sortBy=id&sortDirection=DESC`; // SWR key
  }

  const { data, size, setSize } = useSWRInfinite(
    getKey,
    paginationFetcher<PostInformation>
  );

  const [scroll] = useWindowScroll();

  useEffect(() => {
    if (scroll.y > window.screen.height * size) {
      setSize((prev) => prev + 1);
    }
  }, [scroll]);

  return (
    <div className="post-container">
      {data?.flat()?.map((post) => (
        <div key={post.id} className="my-10">
          <PostCard artist={artist} postInformation={post} />
        </div>
      ))}
    </div>
  );
}
