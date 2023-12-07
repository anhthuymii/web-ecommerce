import React from "react";
import { useLoading } from "../../../hooks/useLoading";
import classes from "./loading.module.css";
import loadingImage from "../../../assets/images/loading.svg"; // Import the image

export default function Loading() {
  const { isLoading } = useLoading();
  if (!isLoading) return;

  return (
    <div className={classes.container}>
      <div className={classes.items}>
        <img src={loadingImage} alt="Loading!" className="mt-10" />
        <h1>Đang tải...</h1>
      </div>
    </div>
  );
}
