export enum Views {
  Table,
  List,
}

const VIEWS_KEY = "home-inventory-views-type";

/**
 * get the view type from localStorage
 */
export function getViewType(): Views {
  const storage = localStorage.getItem(VIEWS_KEY);
  if (storage) return parseInt(storage) as Views;

  return Views.Table;
}

/**
 * update the user's view type in localStorage.
 */
export function setViewType(t: Views) {
  localStorage.setItem(VIEWS_KEY, String(t));

  return t;
}

export function getNewViewType(old: Views): Views {
  return old === Views.Table ? Views.List : Views.Table;
}
