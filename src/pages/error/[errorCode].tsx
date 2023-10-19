import { useRouter } from "next/router";

export default function ErrorPage() {
  const router = useRouter();

  if (!router.isReady) {
    return null;
  }

  const { errorCode } = router.query;

  return (
    <div className="w-full h-full flex justify-center items-center">
      <span>Error {errorCode}</span>
    </div>
  );
}
