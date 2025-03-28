import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  Typography,
  Card,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./ApplySection.css";

const { Title, Text, Link } = Typography;
const { TextArea } = Input;

const ProgramInfoSection = () => (
  <div className="program-info-section">
    <Card className="program-info-card" bordered={false}>
      <Title level={3} className="program-info-title">
        Peer-to-peer Mentorship for Job Search
      </Title>
      <Text className="program-info-description">
      CF Hub is a comprehensive career mentorship platform connecting
						students with industry professionals across diverse sectors
						including investment banking, risk management, finance, business
						analytics, brand management, demand planning, operations,
						consulting, and technology.{" "}
      </Text>
      <Text className="program-info-description">
        Founded at the end of 2023, we have helped over 20 mentees secure
        multiple dream internship and new grad offers in the US.{" "}
      </Text>
      <Text className="program-info-description">
        For more detailed information about the program, please visit:{" "}
      </Text>
      <ul className="program-links">
        <li>
          <Link href="https://www.thepathwise.org/" target="_blank">
            Website
          </Link>
        </li>
        <li>
          <Link
            href="https://www.facebook.com/pathwise.techmentorship/"
            target="_blank"
          >
            Facebook Page
          </Link>
        </li>
        <li>
          <Link href="https://www.instagram.com/cf.hub_2025/" target="_blank">
            Instagram Page
          </Link>
        </li>
        {/* <li>
          <Link href="https://www.instagram.com/pathwise.fin/" target="_blank">
            Instagram Finance
          </Link>
        </li>
        <li>
          <Link
            href="https://www.facebook.com/groups/75656170966028"
            target="_blank"
          >
            Facebook Group
          </Link>
        </li> */}
      </ul>
    </Card>
  </div>
);

const ApplySection = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [waitlistSelection, setWaitlistSelection] = useState("No");

  // Fetch the backend URL from the environment variable
  const apiBaseUrl = "https://pathwise-website-server.onrender.com";

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    for (const key in values) {
      if (key !== "resume") {
        formData.append(key, values[key]);
      }
    }

    if (fileList.length > 0) {
      formData.append("resume", fileList[0].originFileObj);
    }

    try {
      const res = await fetch(`${apiBaseUrl}/api/forms/submit`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to submit the form. Please try again later.");
      }

      const data = await res.json();

      if (data.success) {
        form.resetFields();
        setFileList([]);
        if (values.waitlistConsideration === "Yes") {
          message.success({
            content: (
              <span>
                Form submitted successfully! Since you opted for the waitlist
                for the July 2025 batch (applying for Summer 2026 only), please
                message{" "}
                <a
                  href="https://www.facebook.com/tribuidinh0901/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tri Bui
                </a>{" "}
                to inform us, and we will consider your application.
              </span>
            ),
            duration: 5,
            className: "success-message",
          });
        } else {
          message.success({
            content:
              "Form submitted successfully! We will review your application and get back to you shortly.",
            duration: 5,
            className: "success-message",
          });
        }
      } else {
        message.error({
          content: `Error: ${
            data.message || "Something went wrong. Please try again."
          }`,
          duration: 5,
          className: "error-message",
        });
      }
    } catch (error) {
      message.error({
        content: `Network error: ${error.message}`,
        duration: 5,
        className: "error-message",
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error({
      content: "Please fill out all required fields correctly.",
      duration: 5,
      className: "error-message",
    });
  };

  return (
    <div className="form-section">
      <div className="form-container">
        <ProgramInfoSection />
        <Title level={2} className="form-title">
          Internship/New Grad Mentorship Application
        </Title>
        <Text className="form-description">
          Please fill out the form below to register for our mentorship program.
          We will review your application and get back to you as soon as
          possible.
        </Text>
        <Form
          form={form}
          layout="vertical"
          name="mentorshipForm"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="ant-form-custom"
        >
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="johndoe@example.com" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter your phone number" },
            ]}
          >
            <Input placeholder="+1234567890" />
          </Form.Item>

          <Form.Item
            name="location"
            label="Where are you currently located?"
            rules={[{ required: true, message: "Please select your location" }]}
          >
            <Select placeholder="Select your location">
              <Select.Option value="Vietnam">Vietnam</Select.Option>
              <Select.Option value="USA">USA</Select.Option>
              <Select.Option value="Australia">Australia</Select.Option>
              <Select.Option value="Singapore">Singapore</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="school"
            label="What school are you currently attending?"
            rules={[{ required: true, message: "Please enter your school" }]}
          >
            <Input placeholder="University of Pennsylvania" />
          </Form.Item>

          <Form.Item
            name="currentYear"
            label="What is your current academic year?"
            rules={[
              { required: true, message: "Please select your current year" },
            ]}
          >
            <Select placeholder="Select your current year">
              <Select.Option value="Freshman">Freshman</Select.Option>
              <Select.Option value="Sophomore">Sophomore</Select.Option>
              <Select.Option value="Junior">Junior</Select.Option>
              <Select.Option value="Senior">Senior</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="industryPreference"
            label="What industry are you focusing on for job search?"
            rules={[{ required: true, message: "Please select an industry" }]}
          >
            <Select placeholder="Select the industry">
              <Select.Option value="Investment Banking">
                Investment Banking
              </Select.Option>
              <Select.Option value="Software Engineering">
                Software Engineering
              </Select.Option>
              <Select.Option value="Data Engineering/Data Science/Machine Learning">
                Data Engineering/Data Science/Machine Learning
              </Select.Option>
              <Select.Option value="Consulting">Consulting</Select.Option>
              <Select.Option value="Other">Other…</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="helpDescription"
            label="(Optional) Please answer the question in English: What do you need help with and what do you want to gain from this program?"
          >
            <TextArea rows={4} placeholder="Be as specific as you can" />
          </Form.Item>

          <Form.Item
            name="resume"
            label="Upload your latest Resume (PDF format)"
            rules={[{ required: true, message: "Please upload your resume" }]}
          >
            <Upload
              fileList={fileList}
              beforeUpload={() => false}
              onChange={handleUploadChange}
              multiple={false}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="questionsForUs"
            label="Do you have any questions for us?"
          >
            <TextArea rows={2} placeholder="Your question here..." />
          </Form.Item>

          <Form.Item
            name="waitlistConsideration"
            label="Do you want to be considered for the waitlist for the July 2025 batch? (Applying for Summer 2026 only)"
            rules={[{ required: true, message: "Please select an option" }]}
          >
            <Select
              placeholder="Select your option"
              onChange={(value) => setWaitlistSelection(value)}
            >
              <Select.Option value="No">No</Select.Option>
              <Select.Option value="Yes">Yes</Select.Option>
            </Select>
          </Form.Item>

          {waitlistSelection === "Yes" && (
            <div className="waitlist-message">
              <Text type="secondary">
                Since you opted for the waitlist for the July 2025 batch
                (applying for Summer 2026 only), please message{" "}
                <a
                  href="https://www.facebook.com/tribuidinh0901/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tri Bui
                </a>{" "}
                to inform us.
              </Text>
            </div>
          )}

          <Form.Item>
            <Button className="submit-button" type="primary" htmlType="submit">
              Submit Application
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ApplySection;
