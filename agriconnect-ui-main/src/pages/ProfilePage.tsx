import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { User, MapPin, Phone, Edit2, Camera, CheckCircle, Leaf } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20 lg:pb-0 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-secondary-foreground" />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">{user?.name}</h1>
          <p className="text-muted-foreground flex items-center justify-center gap-1">
            <MapPin className="w-4 h-4" /> {user?.location}
          </p>
          {user?.verified && (
            <span className="inline-flex items-center gap-1 mt-2 text-xs bg-growth/10 text-growth px-3 py-1 rounded-full">
              <CheckCircle className="w-3 h-3" /> Verified
            </span>
          )}
        </div>

        <Card variant="default">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            <Button variant="ghost" size="sm"><Edit2 className="w-4 h-4 mr-2" /> Edit</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm text-muted-foreground">Full Name</label><Input value={user?.name} readOnly /></div>
            <div><label className="text-sm text-muted-foreground">Phone</label><Input value={user?.phone} readOnly /></div>
            <div><label className="text-sm text-muted-foreground">Location</label><Input value={user?.location} readOnly /></div>
          </CardContent>
        </Card>

        {user?.role === 'farmer' && (
          <Card variant="default">
            <CardHeader><CardTitle className="flex items-center gap-2"><Leaf className="w-5 h-5 text-growth" /> Farm Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><label className="text-sm text-muted-foreground">Farm Size</label><Input value="5 Acres" readOnly /></div>
              <div><label className="text-sm text-muted-foreground">Main Crops</label><Input value="Rice, Cotton, Groundnut" readOnly /></div>
              <div><label className="text-sm text-muted-foreground">Experience</label><Input value="10+ years" readOnly /></div>
            </CardContent>
          </Card>
        )}

        <Button variant="hero" className="w-full">Save Changes</Button>
      </motion.div>
    </AppLayout>
  );
};

export default ProfilePage;
