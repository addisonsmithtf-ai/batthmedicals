import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { PasswordResetDialog } from "./PasswordResetDialog";

const UserManagement = () => {
  // Display the two required accounts
  const systemAccounts = [
    {
      id: '1',
      email: 'info@batthmedicals.co.uk',
      role: 'admin',
      status: 'Active'
    },
    {
      id: '2', 
      email: 'media@batthmedicals.co.uk',
      role: 'staff',
      status: 'Active'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                This system uses two fixed accounts. Contact your system administrator to reset passwords.
              </p>
            </div>
            
            {systemAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{account.email}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={account.role === 'admin' ? 'default' : 'secondary'}>
                      {account.role.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-green-600">
                      {account.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <PasswordResetDialog isAdmin={true} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;