import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';

export function usePostsList(page = 1, categorySlug = null) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let path = `/posts?page=${page}&limit=9`;
      if (categorySlug) {
        path += `&category=${encodeURIComponent(categorySlug)}`;
      }
      const result = await api.get(path);
      setData(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, categorySlug]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { data, pagination, loading, error, refetch: fetchPosts };
}

export function usePost(slug) {
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [prevPost, setPrevPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    api.get(`/posts/${encodeURIComponent(slug)}`)
      .then(result => {
        if (!cancelled) {
          setPost(result.data);
          setRelated(result.related || []);
          setPrevPost(result.prev);
          setNextPost(result.next);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message);
          setPost(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [slug]);

  return { post, related, prevPost, nextPost, loading, error };
}
