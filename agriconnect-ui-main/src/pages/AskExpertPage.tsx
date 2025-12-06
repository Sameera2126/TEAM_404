import { useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, CheckCircle, MessageCircle, Clock, X } from 'lucide-react';
import { questions } from '@/data/mockData';
import { formatDistanceToNow } from 'date-fns';

const AskExpertPage = () => {
  const [activeTab, setActiveTab] = useState('unanswered');
  const [selectedQuestion, setSelectedQuestion] = useState(questions[0]);
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const unansweredQuestions = questions.filter(q => q.status === 'pending');
  const answeredQuestions = questions.filter(q => q.status === 'answered');

  const handleSubmitResponse = () => {
    if (!response.trim()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      // Update the question status to answered
      selectedQuestion.status = 'answered';
      selectedQuestion.answer = response;
      selectedQuestion.answeredAt = new Date().toISOString();
      setResponse('');
      setIsSubmitting(false);
      setActiveTab('answered');
    }, 1000);
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
                          key={question.id}
                          onClick={() => setSelectedQuestion(question)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedQuestion?.id === question.id ? 'bg-muted' : 'hover:bg-muted/50'}`}
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
                                <AvatarImage src={question.author?.avatar} />
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
                    {answeredQuestions.length > 0 ? (
                      answeredQuestions.map((question) => (
                        <div
                          key={question.id}
                          onClick={() => setSelectedQuestion(question)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedQuestion?.id === question.id ? 'bg-muted' : 'hover:bg-muted/50'}`}
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
                                <AvatarImage src={question.author?.avatar} />
                                <AvatarFallback>{(question.author?.name?.charAt(0) || 'U').toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">{question.author?.name || 'Anonymous'}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(question.answeredAt || question.createdAt), { addSuffix: true })}
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
                    <Badge variant={selectedQuestion.status === 'answered' ? 'default' : 'secondary'} className="mt-1">
                      {selectedQuestion.status === 'answered' ? 'Answered' : 'Awaiting Response'}
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
                            <AvatarImage src={selectedQuestion.author?.avatar} />
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
                            <p>{selectedQuestion.content}</p>
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
                      </div>
                      
                      {/* Existing Answer (if any) */}
                      {selectedQuestion.status === 'answered' && selectedQuestion.answer && (
                        <div className="space-y-2 pt-4 border-t">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Your Response</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {formatDistanceToNow(new Date(selectedQuestion.answeredAt || selectedQuestion.createdAt), { addSuffix: true })}
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
                      {selectedQuestion.status === 'pending' && (
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
                              {isSubmitting ? 'Submitting...' : 'Submit Response'}
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
