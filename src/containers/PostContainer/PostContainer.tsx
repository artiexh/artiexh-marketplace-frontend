import PostCard from "@/components/PostCard/PostCard";
import { mockData } from "@/mockData/comments";
import { User } from "@/types/User";

export default function PostContainer({ artist }: { artist: User }) {
  return (
    <div className="post-container">
      {mockData.map((post) => (
        <div key={post.id} className="my-10">
          <PostCard artist={artist} postInformation={post} />
        </div>
      ))}
    </div>
  );
}
