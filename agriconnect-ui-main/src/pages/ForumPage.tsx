import { useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Filter,
  Plus,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  CheckCircle,
  Image as ImageIcon,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { forumPosts, categories, crops, currentUser } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

const ForumPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFilter, setSelectedFilter] = useState<string>('Recent');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<typeof forumPosts[0] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredPosts = forumPosts.filter((post) => {
    // Search filter
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;

    // Additional filters
    let matchesFilter = true;
    if (selectedFilter === 'My Posts') {
      matchesFilter = post.author.id === currentUser.id;
    } else if (selectedFilter === 'Unanswered') {
      matchesFilter = !post.isAnswered;
    } else if (selectedFilter === 'Trending') {
      // Simple trending logic based on upvotes and recency
      const daysOld = (new Date().getTime() - post.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      matchesFilter = (post.upvotes - post.downvotes) > 10 && daysOld < 7;
    }

    return matchesSearch && matchesCategory && matchesFilter;
  });

  const handleReadMore = (post: typeof forumPosts[0]) => {
    setSelectedPost(post);
    setCurrentImageIndex(0);
  };

  const handleNextImage = () => {
    if (selectedPost?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedPost.images.length);
    }
  };

  const handlePrevImage = () => {
    if (selectedPost?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedPost.images!.length) % selectedPost.images!.length);
    }
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 pb-20 lg:pb-0"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-1">
              Community Forum
            </h1>
            <p className="text-muted-foreground">Ask questions and share knowledge</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="hero">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-display">Create New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Title
                  </label>
                  <Input placeholder="What's your question about?" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Category
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Description
                  </label>
                  <Textarea placeholder="Describe your question in detail..." className="min-h-[120px]" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Add Images (Optional)
                  </label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag images here
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="hero" className="flex-1" onClick={() => setIsCreateOpen(false)}>
                    Post Question
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['Recent', 'Trending', 'Unanswered', 'My Posts', ...crops.slice(0, 3)].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedFilter === filter
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                variant="elevated"
                className="cursor-pointer hover:-translate-y-0.5 transition-all"
                onClick={() => navigate(`/forum/${post.id}`)}
              >
                <CardContent className="p-5">
                  <div className="flex gap-4">
                    {/* Votes */}
                    <div className="hidden lg:flex flex-col items-center gap-1 text-muted-foreground">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <ThumbsUp className="w-5 h-5" />
                      </button>
                      <span className="font-semibold text-foreground">{post.upvotes - post.downvotes}</span>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <ThumbsDown className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-2">
                        {post.isAnswered && (
                          <span className="flex items-center gap-1 text-xs bg-growth/10 text-growth px-2 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Answered
                          </span>
                        )}
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                          {post.category}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="mb-3">
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {post.content}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReadMore(post);
                          }}
                          className="text-sm text-primary hover:underline"
                        >
                          Read more
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span>{post.author.name}</span>
                          <span>•</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="lg:hidden flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            {post.upvotes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {post.commentsCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No posts found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters
            </p>
            <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </motion.div>

      {/* Post Detail Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedPost && (
            <>
              <DialogHeader className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedPost.author.avatar} alt={selectedPost.author.name} />
                    <AvatarFallback>{selectedPost.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedPost.author.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(selectedPost.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <DialogTitle className="text-xl">{selectedPost.title}</DialogTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                    {selectedPost.category}
                  </span>
                  {selectedPost.crops?.map((crop) => (
                    <span key={crop} className="text-xs bg-muted text-foreground px-2 py-1 rounded-full">
                      {crop}
                    </span>
                  ))}
                </div>
              </DialogHeader>

              <div className="space-y-4">
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line">{selectedPost.content}</p>
                </div>


                <div className="flex items-center gap-4 pt-4 border-t">
                  <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{selectedPost.upvotes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                    <ThumbsDown className="w-4 h-4" />
                    <span>{selectedPost.downvotes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                    <MessageSquare className="w-4 h-4" />
                    <span>{selectedPost.commentsCount} comments</span>
                  </button>
                </div>
              </div>

              <DialogClose asChild>
              </DialogClose>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default ForumPage;
