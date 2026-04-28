import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleBlog, clearSingleBlog } from "../redux/slices/BlogsSlice";
import SEO from "../components/reusable/SEO";
import BlogContentViewer from "../components/BlogsComponents/BlogContentViewer";

const SingleBlog = () => {
  const { slug } = useParams()
  const dispatch = useDispatch();
  const { loading, error, SingleBlog } = useSelector(p => p.blog)
  useEffect(() => {
    // Always fetch when slug changes to ensure fresh data
    dispatch(fetchSingleBlog(slug));
    return () => { dispatch(clearSingleBlog()); };
  }, [slug, dispatch]);
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
          title={SingleBlog.seoTitle || `${SingleBlog.title} | DU Digital Global`}
          description={SingleBlog.seoDescription || SingleBlog.tags || `Read about ${SingleBlog.title} on DU Digital Global.`}
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
          <section className="blog-content" data-color-mode="light">
            <BlogContentViewer content={SingleBlog.content} />
          </section>

          {/* Author Card */}
          {SingleBlog.author?.name && (
            <div className="blog-author-card">
              <div className="blog-author-header">
                <div className="blog-author-name-row">
                  <span className="blog-author-name">
                    By {SingleBlog.author.name}
                    {SingleBlog.author.designation && `, ${SingleBlog.author.designation}`}
                  </span>
                  {SingleBlog.author.linkedin && (
                    <a
                      href={SingleBlog.author.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="blog-author-linkedin"
                      aria-label="LinkedIn profile"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
              {SingleBlog.author.bio && (
                <p className="blog-author-bio">{SingleBlog.author.bio}</p>
              )}
            </div>
          )}
        </article>
      }
    </div>
  );

}
export default SingleBlog;