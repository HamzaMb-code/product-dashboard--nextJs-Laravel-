export function getApiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const data = error.response?.data;

  if (data?.errors) {
    return Object.values(data.errors).flat().join(" ");
  }

  return data?.message || fallback;
}
