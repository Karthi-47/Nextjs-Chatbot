import { useUser } from '@clerk/nextjs';

function useAppState() {
  const { user } = useUser(); // Get the authenticated Clerk user

  return {
    userId: user?.id || null, // Use Clerk user ID, fallback to null if not logged in
  };
}

export default useAppState;
