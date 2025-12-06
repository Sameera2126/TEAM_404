import { useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Filter,
  FileText,
  CheckCircle,
  Calendar,
  MapPin,
  ChevronRight,
  ExternalLink,
  Bell,
  AlertTriangle,
} from 'lucide-react';
import { schemes, advisories, regions } from '@/data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SchemesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedScheme, setSelectedScheme] = useState<typeof schemes[0] | null>(null);
  const navigate = useNavigate();

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch = scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === 'all' || scheme.state === selectedState || scheme.state === 'All India';
    return matchesSearch && matchesState;
  });

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium':
        return 'bg-sun/10 text-sun border-sun/20';
      default:
        return 'bg-secondary text-secondary-foreground border-border';
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-1">
              Government Schemes
            </h1>
            <p className="text-muted-foreground">Explore schemes and stay updated with advisories</p>
          </div>
          <Button 
            onClick={() => navigate('/schemes/new')}
            className="w-full md:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Scheme
          </Button>
        </div>

        <Tabs defaultValue="schemes">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
            <TabsTrigger value="schemes">
              <FileText className="w-4 h-4 mr-2" />
              Schemes
            </TabsTrigger>
            <TabsTrigger value="advisories">
              <Bell className="w-4 h-4 mr-2" />
              Advisories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schemes" className="mt-6 space-y-6">
            {/* Search & Filters */}
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search schemes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12"
                />
              </div>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-full lg:w-48">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Schemes Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredSchemes.map((scheme, index) => (
                <motion.div
                  key={scheme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    variant="elevated"
                    className="cursor-pointer hover:-translate-y-0.5 transition-all"
                    onClick={() => setSelectedScheme(scheme)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        {scheme.isActive && (
                          <span className="flex items-center gap-1 text-xs bg-growth/10 text-growth px-2 py-1 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{scheme.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {scheme.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{scheme.state}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-primary font-medium">
                          View Details
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                      {scheme.deadline && (
                        <div className="flex items-center gap-2 mt-3 text-sm text-sun">
                          <Calendar className="w-4 h-4" />
                          <span>Deadline: {new Date(scheme.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Scheme Detail Modal */}
            {selectedScheme && (
              <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedScheme(null)}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card rounded-2xl shadow-floating max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6 border-b border-border sticky top-0 bg-card z-10">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-display font-bold text-foreground mb-1">
                          {selectedScheme.title}
                        </h2>
                        <p className="text-sm text-muted-foreground">{selectedScheme.state}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedScheme(null)}>
                        ×
                      </Button>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">About</h3>
                      <p className="text-muted-foreground">{selectedScheme.description}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Eligibility</h3>
                      <ul className="space-y-2">
                        {selectedScheme.eligibility.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-growth mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Benefits</h3>
                      <ul className="space-y-2">
                        {selectedScheme.benefits.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-muted-foreground">
                            <span className="text-primary">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">How to Apply</h3>
                      <ol className="space-y-3">
                        {selectedScheme.steps.map((step, i) => (
                          <li key={i} className="flex items-start gap-3 text-muted-foreground">
                            <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0">
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                    <Button variant="hero" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Apply Now
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="advisories" className="mt-6 space-y-4">
            {advisories.map((advisory, index) => (
              <motion.div
                key={advisory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border ${getSeverityStyles(advisory.severity)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        advisory.severity === 'high' || advisory.severity === 'critical'
                          ? 'bg-destructive/20'
                          : advisory.severity === 'medium'
                            ? 'bg-sun/20'
                            : 'bg-secondary'
                      }`}>
                        {advisory.type === 'alert' ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : (
                          <Bell className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium uppercase ${getSeverityStyles(advisory.severity)}`}>
                            {advisory.severity}
                          </span>
                          <span className="text-xs text-muted-foreground">{advisory.region}</span>
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">{advisory.title}</h3>
                        <p className="text-sm text-muted-foreground">{advisory.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Published: {new Date(advisory.publishedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
};

export default SchemesPage;
