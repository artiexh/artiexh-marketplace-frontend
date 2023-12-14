import clsx from "clsx";

export default function NotFoundComponent({
  title,
  classNames,
}: {
  title?: React.ReactNode;
  classNames?: {
    root?: string;
    icon?: string;
    title?: string;
  };
}) {
  return (
    <div
      className={clsx(
        "flex w-full h-full flex-col items-center justify-center",
        classNames?.root
      )}
    >
      <div className={clsx(classNames?.icon)}>
        <svg
          width="102"
          height="98"
          viewBox="0 0 102 98"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50.7167 0.000466428C40.6421 0.0542424 30.8098 2.97374 22.4602 8.39053C14.1107 13.8073 7.61798 21.4787 3.80133 30.4369C-0.0153296 39.3951 -0.984964 49.2387 1.01476 58.7258C3.01449 68.2129 7.89401 76.9184 15.0376 83.7439C22.1813 90.5695 31.2689 95.2095 41.1541 97.0782C51.0394 98.9469 61.2792 97.9607 70.5817 94.2441C79.8843 90.5276 87.8327 84.2471 93.4242 76.1951C99.0157 68.1431 102 58.6803 102 49.0006C101.992 42.545 100.658 36.1545 98.0745 30.1952C95.491 24.2359 91.7088 18.8251 86.9445 14.273C82.1803 9.72089 76.5278 6.11695 70.3111 3.66779C64.0944 1.21863 57.4357 -0.0276837 50.7167 0.000466428ZM52.9024 28.8951C55.5333 26.0951 59.581 25.4533 61.9488 27.495C64.3167 29.5367 64.1143 33.4645 61.5036 36.2645C58.8929 39.0645 54.825 39.7062 52.4369 37.6645C50.0488 35.6229 50.2107 31.6951 52.9024 28.8951ZM37.0357 30.3729C37.7742 29.5948 38.7281 29.035 39.7857 28.7589C40.8433 28.4829 41.9609 28.5021 43.0076 28.8142C44.0543 29.1264 44.9868 29.7186 45.6958 30.5216C46.4048 31.3245 46.8611 32.3049 47.0112 33.3479C47.1613 34.391 46.9989 35.4535 46.5432 36.4112C46.0875 37.3688 45.3573 38.1818 44.438 38.7551C43.5187 39.3284 42.4485 39.6382 41.3526 39.6483C40.2567 39.6583 39.1805 39.3681 38.25 38.8117C36.9292 37.846 36.0556 36.4209 35.8171 34.8427C35.5787 33.2645 35.9945 31.6595 36.975 30.3729H37.0357ZM57.5167 58.47C58.5648 61.079 58.5648 63.9695 57.5167 66.5785C53.1048 75.2701 42.7631 71.0312 42.0345 67.57C41.7975 64.9701 40.6148 62.5335 38.694 60.688C36.7732 58.8425 34.2371 57.7062 31.531 57.4785C27.9286 56.759 23.4357 46.8423 32.5429 42.5839C35.2605 41.5879 38.2645 41.5879 40.9821 42.5839C42.7765 42.9916 44.6488 42.9582 46.4262 42.4867C49.6036 42.0201 52.781 40.7757 56.1202 43.984C59.4595 47.1923 58.144 50.2645 57.6785 53.2979C57.1679 54.9789 57.0915 56.7542 57.456 58.47H57.5167ZM70.4488 62.4756C69.4298 62.8604 68.3179 62.9586 67.243 62.7586C66.1681 62.5587 65.1745 62.0689 64.3786 61.3466C63.5826 60.6243 63.0171 59.6992 62.7481 58.6795C62.4791 57.6598 62.5177 56.5876 62.8594 55.5883C63.2012 54.5889 63.8319 53.7035 64.6779 53.0358C65.524 52.3681 66.5503 51.9455 67.6371 51.8174C68.7238 51.6894 69.826 51.8612 70.8149 52.3127C71.8038 52.7642 72.6385 53.4768 73.2214 54.3673C73.9541 55.8052 74.0675 57.4625 73.5372 58.9802C73.0068 60.4979 71.8755 61.7538 70.3881 62.4756H70.4488ZM71.7036 46.92C68.7893 49.4478 64.7012 49.6423 62.5762 47.3673C60.4512 45.0923 61.1191 41.1839 64.0333 38.6756C66.9476 36.1672 71.0357 35.9534 73.1607 38.2284C75.2857 40.5034 74.5774 44.4312 71.6429 46.9589L71.7036 46.92Z"
            fill="#C8CAD3"
          />
        </svg>
      </div>
      <div
        className={clsx(
          "mt-6 font-semibold text-center leading-snug",
          classNames?.icon
        )}
      >
        {title ?? (
          <>
            Không tìm thấy thông tin phù hợp
            <br />
            vui lòng quay lại sau
          </>
        )}
      </div>
    </div>
  );
}
