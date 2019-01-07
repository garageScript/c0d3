export const loadComponent = fn => {
  return ({ loading, error, data, client, refetch }) => {
    if (loading) return 'Loading';
    if (error) return 'error';
    return fn(data, client, refetch);
  };
};
