import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import cluster from 'cluster';
import os from 'os';
import { ConnectDB } from './db';

// Routes
import investorRoutes from './routes/investor.routes';
import officeRoutes from './routes/office.routes';
import contactRoutes from './routes/contact.routes';
import partnerRoutes from './routes/partner.routes';
import galleryRoutes from './routes/gallery.routes';
import newsRoutes from './routes/news.routes';
import eventRoutes from './routes/event.routes';
import careerRoutes from './routes/career.routes';
import employeeRoutes from './routes/employee.routes';
import salesExpertRoutes from './routes/salesExpert.routes';
import videoRoutes from './routes/video.routes';
import blogRoutes from './routes/blog.routes';
import teamMemberRoutes from './routes/teamMember.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import travelPackageRoutes from './routes/travelPackage.routes';
import travelInquiryRoutes from './routes/travelInquiry.routes';
import formRoutes from './routes/form.routes';
import documentRoutes from './routes/document.routes';
import faqRoutes from './routes/faq.routes';
import contentSectionRoutes from './routes/contentSection.routes';
import pricingPlanRoutes from './routes/pricingPlan.routes';
import formImageRoutes from './routes/formImage.routes';
import formEmployeesAddressRoutes from './routes/formEmployeesAddress.routes';
import formSubmissionRoutes from './routes/formSubmission.routes';
import otpRoutes from './routes/otp.routes';
import uploadRoutes from './routes/upload.routes';

// Load environment variables
dotenv.config();

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < 1; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const app = express();
  const port = process.env.PORT || 5000;

  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ extended: true, limit: '100mb' }));

  // Enable CORS
  app.use(cors({
    origin: '*',
    credentials: true
  }));

  // Static folder
  app.use('/api/uploads', express.static(path.join(__dirname, '../uploads'), {
    setHeaders: (res, path) => {
      if (path.endsWith('.pdf')) {
        res.setHeader('Content-Type', 'application/pdf');
      }
    }
  }));


  // DB Connection
  ConnectDB();

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/investor', investorRoutes);
  app.use('/api/office', officeRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/partner', partnerRoutes);
  app.use('/api/gallery', galleryRoutes);
  app.use('/api/news', newsRoutes);
  app.use('/api/events',((req,res,next)=>{
    console.log("events");
    next();
  }), eventRoutes);
  app.use('/api/careers', careerRoutes);
  app.use('/api/employees', employeeRoutes);
  app.use('/api/sales-experts', salesExpertRoutes);
  app.use('/api/videos', videoRoutes);
  app.use('/api/blogs', blogRoutes);
  app.use('/api/team-members', teamMemberRoutes);
  app.use('/api/travel-packages', travelPackageRoutes);
  app.use('/api/travel-inquiries', travelInquiryRoutes);
  app.use('/api/forms', formRoutes);
  app.use('/api/documents', documentRoutes);
  app.use('/api/faqs', faqRoutes);
  app.use('/api/content-sections', contentSectionRoutes);
  app.use('/api/pricing-plans', pricingPlanRoutes);
  app.use('/api/form-images', formImageRoutes);
  app.use('/api/form-employees-addresses', formEmployeesAddressRoutes);
  app.use('/api/form-submissions', formSubmissionRoutes);
  app.use('/api/otp', otpRoutes);
  app.use('/api/upload', uploadRoutes);

  app.get('/', (req: Request, res: Response) => {
    console.log("req.body",req.body)
    console.log("req.params",req.params)
    console.log("req.query",req.query)
    res.send('Hello World');
  });
  
  // 1000.2b879d38ae30eafb54abe054e4eedd58.9b25353dce3aacd9327362ae6e682846

  app.listen(port, () => {
    console.log(`Worker ${process.pid} started. Server running on http://localhost:${port}`);
  });
}