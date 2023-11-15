import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";

const arr = [
  { title: "Home", path: "home" },
  { title: "Posts", path: "posts" },
];

export default function ShopTabsContainer() {
  const router = useRouter();

  return (
    <div className="flex gap-x-2">
      {arr.map((data) => {
        return (
          <Link
            href={`/shop/${router.query.name}/${data.path}`}
            className={clsx(
              "rounded-full px-6 py-1 bg-white text-primary",
              router.pathname.includes(data.path) && "!bg-primary text-white"
            )}
          >
            {data.title}
          </Link>
        );
      })}
    </div>
  );
}
