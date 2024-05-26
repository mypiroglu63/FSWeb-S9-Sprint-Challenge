import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import AppFunctional from "./AppFunctional";

const mock = new MockAdapter(axios);

describe("AppFunctional component tests", () => {
  beforeEach(() => {
    mock.reset();
  });

  test("Sol butona tıklandığında uygun uyarı mesajı görüntülenmeli", () => {
    render(<AppFunctional />);
    fireEvent.click(screen.getByText("SOL"));
    expect(screen.getByText("Sola gidemezsiniz")).toBeInTheDocument();
  });

  test("Sağ butona tıklandığında uygun uyarı mesajı görüntülenmeli", () => {
    render(<AppFunctional />);
    fireEvent.click(screen.getByText("SAĞ"));
    expect(screen.getByText("Sağa gidemezsiniz")).toBeInTheDocument();
  });

  test("Yukarı butona tıklandığında uygun uyarı mesajı görüntülenmeli", () => {
    render(<AppFunctional />);
    fireEvent.click(screen.getByText("YUKARI"));
    expect(screen.getByText("Yukarıya gidemezsiniz")).toBeInTheDocument();
  });

  test("Aşağı butona tıklandığında uygun uyarı mesajı görüntülenmeli", () => {
    render(<AppFunctional />);
    fireEvent.click(screen.getByText("AŞAĞI"));
    expect(screen.getByText("Aşağıya gidemezsiniz")).toBeInTheDocument();
  });

  test("Form gönderimi doğru şekilde çalışmalı", async () => {
    render(<AppFunctional />);
    const emailInput = screen.getByPlaceholderText("email girin");
    const submitButton = screen.getByText("Submit");

    userEvent.type(emailInput, "test@example.com");

    fireEvent.click(submitButton);

    await waitFor(() => {
      mock.onPost("http://localhost:9000/api/result").reply(200, {
        message: "Test başarılı, e-posta test@example.com ile gönderildi!",
      });
    });

    expect(
      await screen.findByText(
        "Test başarılı, e-posta test@example.com ile gönderildi!"
      )
    ).toBeInTheDocument();
  });
});
