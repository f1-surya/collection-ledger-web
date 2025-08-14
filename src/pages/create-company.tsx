import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";

const companySchema = z.object({
  name: z.string().min(3).trim(),
  email: z.email(),
  phone: z.string().trim(),
  address: z.string().trim(),
});

export default function CreateCompany() {
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
  });
  const navigate = useNavigate();

  const handleSubmit = (values: z.infer<typeof companySchema>) => {
    api
      .post("/company", values)
      .then(() => {
        navigate("/dashboard");
      })
      .catch((e) => {
        const errorBody = e.response.data;
        if (errorBody) {
          const messageParts = (errorBody.message as string).split(":");
          if (messageParts.length === 1) {
            toast.error(messageParts[0]);
          } else {
            // @ts-ignore
            form.setError(messageParts[0], { message: messageParts[1] });
          }
        }
      });
  };

  return (
    <main className="flex items-center justify-center h-dvh w-dvw">
      <Card className="md:w-[40%] m-2 text-center">
        <CardHeader>
          <CardTitle className="text-xl">{t("almostDone")}</CardTitle>
          <CardDescription>{t("companyDetails")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-4 text-start"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company name*</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Example ltd."
                        required
                      />
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number*</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        placeholder="+91-9090304040"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address*</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Some street, That city, 600600"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit">
                {t("save")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
