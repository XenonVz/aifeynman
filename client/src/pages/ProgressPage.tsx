import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from "recharts";

const ProgressPage = () => {
  // Mock data for charts
  const sessionsBySubject = [
    { name: "Physics", sessions: 8 },
    { name: "Math", sessions: 12 },
    { name: "Biology", sessions: 5 },
    { name: "Chemistry", sessions: 3 },
    { name: "English", sessions: 6 }
  ];
  
  const feynmanStepCompletion = [
    { name: "Explain", completed: 15 },
    { name: "Review", completed: 12 },
    { name: "Simplify", completed: 9 },
    { name: "Analogize", completed: 7 }
  ];
  
  const quizScores = [
    { name: "Week 1", score: 70 },
    { name: "Week 2", score: 75 },
    { name: "Week 3", score: 82 },
    { name: "Week 4", score: 88 },
    { name: "Week 5", score: 92 }
  ];
  
  const gapsCoverage = [
    { name: "Covered", value: 72 },
    { name: "Partially Covered", value: 18 },
    { name: "Not Covered", value: 10 }
  ];
  
  const COLORS = ["#34D399", "#F59E0B", "#EF4444"];
  
  const recentTopics = [
    { name: "Newton's Laws of Motion", score: 92, date: "May 15, 2024" },
    { name: "Algebra: Quadratic Equations", score: 88, date: "May 12, 2024" },
    { name: "Cell Biology: Mitosis", score: 78, date: "May 10, 2024" }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Learning Progress</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Sessions By Subject */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Teaching Sessions by Subject</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionsBySubject}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sessions" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Feynman Step Completion */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Feynman Steps Completed</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feynmanStepCompletion}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="hsl(var(--accent))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Quiz Scores Over Time */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quiz Scores Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quizScores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2} 
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Gap Coverage */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Concept Coverage</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gapsCoverage}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {gapsCoverage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recently Taught Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Topic</th>
                    <th className="text-left py-3 px-4">Quiz Score</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTopics.map((topic, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{topic.name}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-16 h-2 bg-neutral-200 rounded-full mr-2">
                            <div
                              className={`h-full rounded-full ${
                                topic.score >= 90 
                                  ? "bg-green-500" 
                                  : topic.score >= 70 
                                  ? "bg-yellow-500" 
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${topic.score}%` }}
                            ></div>
                          </div>
                          <span>{topic.score}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{topic.date}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button className="text-xs text-primary hover:underline">Review</button>
                          <button className="text-xs text-primary hover:underline">Continue</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressPage;
