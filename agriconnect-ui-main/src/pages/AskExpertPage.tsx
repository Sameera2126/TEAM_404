import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, CheckCircle, MessageCircle, Clock, X, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { getAllPosts, answerQuestion, ForumPost } from '@/services/forumService';

const AskExpertPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('unanswered');
  const [selectedQuestion, setSelectedQuestion] = useState<ForumPost | null>(null);
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<ForumPost[]>([]);

  // Fetch all questions from forum
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await getAllPosts({ page: 1, limit: 100 });
      setQuestions(response.data || []);
      
      // Set first unanswered question as selected if available
      const unanswered = response.data?.filter(q => !q.isAnswered);
      if (unanswered && unanswered.length > 0 && !selectedQuestion) {
        setSelectedQuestion(unanswered[0]);
      } else if (response.data && response.data.length > 0 && !selectedQuestion) {
        setSelectedQuestion(response.data[0]);
      }
    } catch (error: any) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const unansweredQuestions = questions.filter(q => !q.isAnswered);
  const answeredQuestions = questions.filter(q => q.isAnswered);

  const handleSubmitResponse = async () => {
    if (!response.trim() || !selectedQuestion) return;
    
    try {
      setIsSubmitting(true);
      const updatedPost = await answerQuestion(selectedQuestion._id, response);
      
      // Update the question in the list
      setQuestions(prev => prev.map(q => 
        q._id === selectedQuestion._id ? updatedPost : q
      ));
      
      setSelectedQuestion(updatedPost);
      setResponse('');
      setActiveTab('answered');
      toast.success('Answer submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting answer:', error);
      toast.error(error.response?.data?.message || 'Failed to submit answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 pb-20 lg:pb-0"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Questions List */}
          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="text-xl">Farmer Queries</CardTitle>
                <CardDescription>Manage and respond to community questions</CardDescription>
              </CardHeader>
              <Tabs 
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex-1 flex flex-col"
              >
                <TabsList className="w-full rounded-none border-b bg-transparent p-0">
                  <TabsTrigger 
                    value="unanswered" 
                    className="relative flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none"
                  >
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Unanswered
                      {unansweredQuestions.length > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {unansweredQuestions.length}
                        </Badge>
                      )}
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="answered" 
                    className="relative flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Answered
                    </div>
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex-1 overflow-y-auto">
                  <TabsContent value="unanswered" className="m-0 p-4 space-y-3">
                    {unansweredQuestions.length > 0 ? (
                      unansweredQuestions.map((question) => (
                        <div
                          key={question._id}
                          onClick={() => setSelectedQuestion(question)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedQuestion?._id === question._id ? 'bg-muted' : 'hover:bg-muted/50'}`}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm line-clamp-2">{question.title}</h4>
                            <Badge variant="outline" className="ml-2 flex-shrink-0">
                              {question.category}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={question.author?.avatar || undefined} />
                                <AvatarFallback>{(question.author?.name?.charAt(0) || 'U').toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">{question.author?.name || 'Anonymous'}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        No unanswered questions at the moment
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="answered" className="m-0 p-4 space-y-3">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      </div>
                    ) : answeredQuestions.length > 0 ? (
                      answeredQuestions.map((question) => (
                        <div
                          key={question._id}
                          onClick={() => setSelectedQuestion(question)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedQuestion?._id === question._id ? 'bg-muted' : 'hover:bg-muted/50'}`}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm line-clamp-2">{question.title}</h4>
                            <Badge variant="outline" className="ml-2 flex-shrink-0">
                              {question.category}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={question.author?.avatar || undefined} />
                                <AvatarFallback>{(question.author?.name?.charAt(0) || 'U').toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">{question.author?.name || 'Anonymous'}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(question.answer?.answeredAt || question.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        No answered questions yet
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>

          {/* Question Details & Response */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="text-xl">
                  {selectedQuestion ? 'Question Details' : 'Select a question'}
                </CardTitle>
                <CardDescription>
                  {selectedQuestion && (
                    <Badge variant={selectedQuestion.isAnswered ? 'default' : 'secondary'} className="mt-1">
                      {selectedQuestion.isAnswered ? 'Answered' : 'Awaiting Response'}
                    </Badge>
                  )}
                </CardDescription>
              </CardHeader>
              
              {selectedQuestion ? (
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-6">
                      {/* Question */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={selectedQuestion.author?.avatar || undefined} />
                            <AvatarFallback>{(selectedQuestion.author?.name?.charAt(0) || 'U').toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{selectedQuestion.author?.name || 'Anonymous'}</p>
                            <p className="text-sm text-muted-foreground">
                              Asked {formatDistanceToNow(new Date(selectedQuestion.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{selectedQuestion.title}</h3>
                          <div className="prose prose-sm max-w-none">
                            <p>{selectedQuestion.description || selectedQuestion.content}</p>
                          </div>
                        </div>
                        
                        {selectedQuestion.images && selectedQuestion.images.length > 0 && (
                          <div className="grid grid-cols-2 gap-3 mt-4">
                            {selectedQuestion.images.map((img, i) => (
                              <div key={i} className="aspect-video bg-muted rounded-lg overflow-hidden">
                                <img 
                                  src={img} 
                                  alt={`Question image ${i + 1}`} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        {selectedQuestion.image && (
                          <div className="mt-4 rounded-lg overflow-hidden">
                            <img 
                              src={selectedQuestion.image} 
                              alt={selectedQuestion.title}
                              className="w-full h-auto"
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Existing Answer (if any) */}
                      {selectedQuestion.isAnswered && selectedQuestion.answer && (
                        <div className="space-y-2 pt-4 border-t">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Expert Response</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {formatDistanceToNow(new Date(selectedQuestion.answer.answeredAt || selectedQuestion.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="whitespace-pre-line">{selectedQuestion.answer.content}</p>
                            {selectedQuestion.answer.expert && (
                              <div className="mt-3 pt-3 border-t border-border/50 text-sm text-muted-foreground">
                                Answered by {selectedQuestion.answer.expert.name}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Response Form */}
                      {!selectedQuestion.isAnswered && user?.role === 'expert' && (
                        <div className="space-y-4 pt-4 border-t">
                          <div className="space-y-2">
                            <label htmlFor="response" className="text-sm font-medium">
                              Your Response
                            </label>
                            <Textarea
                              id="response"
                              placeholder="Type your detailed response here..."
                              className="min-h-[200px]"
                              value={response}
                              onChange={(e) => setResponse(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              Your response will be visible to the farmer and the community.
                            </p>
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setResponse('')}
                              disabled={isSubmitting}
                            >
                              Clear
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={handleSubmitResponse}
                              disabled={!response.trim() || isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Submitting...
                                </>
                              ) : (
                                'Submit Response'
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No question selected</h3>
                  <p className="text-muted-foreground text-sm max-w-md">
                    Select a question from the list to view details and provide a response.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default AskExpertPage;
