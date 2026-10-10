"use client";

import { useEffect } from "react";
import { useStore } from "./StoreProvider";

export default function ClearCart() {
  const { clear } = useStore();
  useEffect(clear, [clear]);
  return null;
}
