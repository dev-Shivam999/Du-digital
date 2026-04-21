import { useEffect, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleBlog } from "../redux/slices/BlogsSlice";
import SEO from "../components/reusable/SEO";

const MarkdownPreview = lazy(() => import("@uiw/react-markdown-preview"));

const SingleBlog = () => {
  const { id } = useParams()
  const dispatch = useDispatch();
  const { loading, error, SingleBlog } = useSelector(p => p.blog)
  useEffect(() => {
    dispatch(fetchSingleBlog(id))
  }, [id])
  const BackendImagesURL = import.meta.env.VITE_BACKEND_IMAGES_URL || 'http://localhost:5000/api';
  const BackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    // Handle /api/ paths - use BackendURL directly
    if (imagePath.startsWith('/api/')) {
      return `${BackendURL}${imagePath}`;
    }
    // Handle /uploads/ paths
    if (imagePath.startsWith('/uploads/')) {
      return `${BackendURL}/api${imagePath}`;
    }
    return `${BackendImagesURL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };
  return (
    <div>
      {SingleBlog && (
        <SEO
          title={`${SingleBlog.title} | DU Digital Global`}
          description={SingleBlog.summary || `Read about ${SingleBlog.title} on DU Digital Global.`}
        />
      )}
      {loading ? <div>loading</div> : error ? <div>error</div> : SingleBlog &&
        <article className="blog-container">
          {/* Header */}
          <header className="blog-header">
            <div>
              <h1 className="blog-title w-[500px]">{SingleBlog.title}</h1></div>

            <div className="blog-meta flex flex-col">
              <p className="blog-category">{SingleBlog.category}</p>
              {/* <span>By {SingleBlog.author?.name}</span>
              <span>•</span> */}
              <span>{new Date(SingleBlog.publishedAt).toLocaleDateString()}</span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="blog-image">
            <img
              src={getImageUrl(SingleBlog.featuredImage)}
              alt={SingleBlog.title}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              width="800"
              height="650"
            />
          </div>

          {/* Content */}
          <section
            className="blog-content"
            data-color-mode="light"
          >
            <Suspense fallback={<div>Loading content...</div>}>
              <MarkdownPreview source={SingleBlog.content} style={{ background: 'transparent' }} />
            </Suspense>
          </section>
        </article>
      }
    </div>
  );

}
export default SingleBlog;