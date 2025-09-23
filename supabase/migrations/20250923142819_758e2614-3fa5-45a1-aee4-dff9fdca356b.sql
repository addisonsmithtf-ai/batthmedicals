-- Update the admin user's role from 'staff' to 'admin'
UPDATE user_roles 
SET role = 'admin'::app_role 
WHERE user_id = 'd931efb6-4f85-4d80-91a8-be3420c2f648';