import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";

const schema = z.object({
  email: z.email().nonempty(),
  password: z.string(),
});

export default function Login() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();

  const handleSubmit = (values: z.infer<typeof schema>) => {
    api
      .post("/auth/login", values)
      .then((res) => {
        if (res.status === 200) {
          sessionStorage.accessToken = res.data.accessToken;
          sessionStorage.refreshToken = res.data.refreshToken;
          navigate("/app");
        }
      })
      .catch((e) => {
        const errorBody = e.response.data;
        if (errorBody.password) {
          form.setError(
            "password",
            { message: errorBody.password },
            { shouldFocus: true },
          );
        } else if (errorBody.email) {
          form.setError(
            "email",
            { message: errorBody.email },
            { shouldFocus: true },
          );
        } else {
          toast.error(e.response.data.message);
          console.error(e);
        }
      });
  };

  return (
    <main className="flex items-center justify-center h-dvh w-dvw">
      <Card className="md:w-[40%] m-2 text-center">
        <CardHeader>
          <CardTitle className="text-xl">Login to continue</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4 text-start"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="example@mail.com"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password*</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="MyStrongPassword"
                        type="password"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-center w-full">
            Don&apos;t have an account?,{" "}
            <Link to="/signup" className="text-blue-600">
              Signup here
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
