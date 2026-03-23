import NotificationLine from "public/assets/line/notification.svg";

export default () => {
  return (
    <button className="size-8 relative rounded-xs">
      <NotificationLine className="size-5 m-auto" />

      <div className="size-2 bg-[#46F1CF] rounded-full absolute top-0 right-0 -translate-x-1/4 translate-y-1/4" />
    </button>
  );
};
