import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const renderMostRecentRelativeTime = (createdAt, updatedAt) => {
  return updatedAt > createdAt
    ? `Edited ${dayjs(updatedAt).fromNow()}`
    : dayjs(createdAt).fromNow();
};

export const renderCreatedAtRelativeTime = (createdAt) => {
  return dayjs(createdAt).fromNow();
};

export const renderUpdatedAtRelativeTime = (updatedAt) => {
  return `Edited ${dayjs(updatedAt).fromNow()}`;
};

export const renderCreatedDate = (createdAt) => {
  return `Uploaded ${dayjs(createdAt).format("DD/MM/YYYY")}`;
};

export const renderUpdatedDate = (updatedAt) => {
  return `Last updated ${dayjs(updatedAt).format("DD/MM/YYYY")}`;
};

export default dayjs;
