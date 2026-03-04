// pip.store.js — localStorage helpers + experiences state management

import { useState, useEffect, useCallback } from "react";
import { EXPERIENCES_KEY,SEED_EXPERIENCES } from "./constants";

export function load(key, def) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return def;
    return JSON.parse(raw) ?? def;
  } catch {
    return def;
  }
}

export function save(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

/**
 * Returns all experiences = seed data merged with user-submitted ones.
 * User-submitted are stored under EXPERIENCES_KEY.
 */
export function useExperiences() {
  const [userExps, setUserExps] = useState(() => load(EXPERIENCES_KEY, []));

  // Persist whenever user list changes
  useEffect(() => {
    save(EXPERIENCES_KEY, userExps);
  }, [userExps]);

  // Merge: user submissions first, then seed data
  const allExps = [...userExps, ...SEED_EXPERIENCES];

  const addExperience = useCallback((data) => {
    const entry = {
      ...data,
      id: "user_" + Date.now(),
      date: new Date().toISOString().slice(0, 10),
      isSeed: false,
    };
    setUserExps((prev) => [entry, ...prev]);
    return entry;
  }, []);

  return { allExps, userExps, addExperience };
}
