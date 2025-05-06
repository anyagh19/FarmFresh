import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input } from "../../Index";
import farmerService from "../../Appwrite/Farmer";
import { toast } from "react-toastify";

const CommunityPage = () => {
  const { register, handleSubmit, reset } = useForm();
  const [posts, setPosts] = useState([]);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState(null);  // State to track expanded post

  const fetchPosts = async () => {
    try {
      const response = await farmerService.listCommunityPosts();
      setPosts(response.documents);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      toast.error("Failed to load posts.");
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const userData = await farmerService.getCurrentUser();
      if (!userData?.$id) {
        toast.error("Please login to post.", { position: "top-center" });
        return;
      }

      let fileID = null;
      if (file) {
        const uploaded = await farmerService.uploadProductFile(file, userData.$id);
        fileID = uploaded.$id;
      }

      const postPayload = {
        name: data.name,
        story: data.story,
        photo: fileID,
        farmerID: userData.$id,
      };

      const created = await farmerService.createCommunityPost(postPayload);
      if (created) {
        toast.success("Post added successfully!", { position: "top-center" });
        reset();
        setFile(null);
        setShowForm(false);
        fetchPosts();
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      toast.error("Failed to add post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReadMore = (postId) => {
    // Toggle the expanded state for the clicked post
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Community Feed</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Story
        </button>
      </div>

      {/* Popup Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-xl w-full max-w-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-xl text-gray-600 hover:text-red-600"
              onClick={() => setShowForm(false)} // Close the modal when the "X" button is clicked
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Share Your Story</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Name"
                placeholder="Enter your name"
                {...register("name", { required: true })}
              />
              <Input
                label="Story"
                placeholder="Tell your story (optional)"
                {...register("story")}
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
              >
                {isSubmitting ? "Posting..." : "Post"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((post) => {
          const isLongStory = post.story && post.story.length > 150;
          const truncatedStory = isLongStory ? `${post.story.substring(0, 150)}...` : post.story;
          const isExpanded = expandedPostId === post.$id; // Check if this post is expanded

          return (
            <div key={post.$id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition p-6 w-full flex flex-col gap-6">
              {/* Left Side: Image */}
              {post.photo && (
                <div className="w-64 h-64 overflow-hidden rounded-lg">
                  <img
                    src={farmerService.getProductFilePreview(post.photo)}
                    alt={post.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Right Side: Name and Story */}
              <div className="flex flex-col flex-grow">
                <h2 className="text-2xl font-semibold mb-2">{post.name}</h2>
                <p className="text-gray-700 text-base mb-4">
                  {isExpanded ? post.story : truncatedStory} {/* Show full story or truncated */}
                  {isLongStory && (
                    <button
                      onClick={() => handleReadMore(post.$id)}
                      className="text-blue-600 hover:underline"
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </button>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommunityPage;
