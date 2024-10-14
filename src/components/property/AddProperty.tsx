import { Link } from "lucide-react";
import { Button } from "../ui/button";

const AddProperty = ({ userId }: { userId: string }) => {
  return (
    <Link href={`/user/${userId}/add-property`}>
      <Button>Add New Property</Button>
    </Link>
  );
};

export default AddProperty;
