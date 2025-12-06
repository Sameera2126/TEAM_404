import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Cloud, Droplets, Wind, Thermometer, AlertTriangle } from 'lucide-react';
import { currentWeather, weatherForecast, advisories } from '@/data/mockData';

const WeatherPage = () => {
  const getWeatherIcon = (condition: string, size = 'w-8 h-8') => {
    switch (condition) {
      case 'sunny': return <Sun className={`${size} text-sun`} />;
      case 'cloudy': return <Cloud className={`${size} text-muted-foreground`} />;
      case 'rainy': return <Droplets className={`${size} text-blue-500`} />;
      default: return <Sun className={`${size} text-sun`} />;
    }
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20 lg:pb-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-1">Weather</h1>
          <p className="text-muted-foreground">Current conditions and 7-day forecast</p>
        </div>

        {/* Current Weather */}
        <Card variant="elevated" className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getWeatherIcon(currentWeather.condition, 'w-16 h-16')}
                <div>
                  <p className="text-5xl font-bold text-foreground">{currentWeather.temperature}°C</p>
                  <p className="text-muted-foreground capitalize">{currentWeather.condition}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2"><Droplets className="w-4 h-4 text-blue-500" /><span>{currentWeather.humidity}%</span></div>
                <div className="flex items-center gap-2"><Wind className="w-4 h-4" /><span>{currentWeather.windSpeed} km/h</span></div>
                <div className="flex items-center gap-2"><Thermometer className="w-4 h-4 text-primary" /><span>Soil: {currentWeather.soilMoisture}%</span></div>
                <div className="flex items-center gap-2"><Sun className="w-4 h-4 text-sun" /><span>UV: {currentWeather.uvIndex}</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 7-Day Forecast */}
        <Card variant="default">
          <CardHeader><CardTitle>7-Day Forecast</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weatherForecast.map((day, i) => (
                <div key={i} className="text-center p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <p className="text-xs text-muted-foreground mb-2">{new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}</p>
                  {getWeatherIcon(day.condition, 'w-6 h-6 mx-auto')}
                  <p className="text-sm font-semibold mt-2">{day.high}°</p>
                  <p className="text-xs text-muted-foreground">{day.low}°</p>
                  <p className="text-xs text-blue-500 mt-1">{day.rainChance}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weather Alerts */}
        {advisories.filter(a => a.type === 'alert').slice(0, 2).map((alert) => (
          <Card key={alert.id} className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <p className="font-semibold text-destructive">{alert.title}</p>
                <p className="text-sm text-destructive/80">{alert.content}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </AppLayout>
  );
};

export default WeatherPage;
