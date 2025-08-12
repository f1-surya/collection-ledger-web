import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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

const signupSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[a-z]/, { message: "Password must contain a lowercase letter." })
    .regex(/[A-Z]/, { message: "Password must contain an uppercase letter." })
    .regex(/\d/, { message: "Password must contain a digit." })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain a special character.",
    }),
  passWordRepeat: z.string().min(8),
});

export default function Signup() {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = (values: z.infer<typeof signupSchema>) => {
    console.log(values.password, values.passWordRepeat);
    if (values.passWordRepeat !== values.password) {
      form.setError("passWordRepeat", { message: "Passwords do not match." });
      return;
    }
    api
      .post("/auth/signup", values)
      .then((res) => {
        sessionStorage.accessToken = res.data.accessToken;
        sessionStorage.refreshToken = res.data.refreshToken;
        navigate("/createCompany");
      })
      .catch((e) => {
        const errorMessage = e.response.data.message as string;
        if (errorMessage) {
          const errorData = errorMessage.split(":");
          form.setError(
            // @ts-ignore
            errorData[0],
            { message: errorData[1] },
            { shouldFocus: true },
          );
        } else {
          toast.error(e.response.data.message);
        }
      });
  };

  return (
    <main className="flex items-center justify-center h-dvh w-dvw">
      <Card className="md:w-[40%] m-2 text-center">
        <CardHeader>
          <CardTitle className="text-xl">Collection ledger</CardTitle>
          <CardDescription>{t("signupDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4 text-start"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="passWordRepeat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repeat password*</FormLabel>
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
                {t("continue")}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-center w-full">
            Already have an account?,{" "}
            <Link to="/login" className="text-blue-600">
              Login here
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
