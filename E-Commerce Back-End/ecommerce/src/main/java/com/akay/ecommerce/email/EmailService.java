package com.akay.ecommerce.email;

import com.akay.ecommerce.entity.OrderItem;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.springframework.mail.javamail.MimeMessageHelper.MULTIPART_MODE_MIXED;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Async
    public void sendEmail(
            String to,
            String username,
            EmailTemplateName emailTemplate,
            String confirmationUrl,
            String activationCode,
            String subject
    ) throws MessagingException {
        String templateName;
        if (emailTemplate == null) {
            templateName = "confirm-email";
        } else {
            templateName = emailTemplate.name();
        }
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                MULTIPART_MODE_MIXED,
                UTF_8.name()
        );
        Map<String, Object> properties = new HashMap<>();
        properties.put("username", username);
        properties.put("confirmationUrl", confirmationUrl);
        properties.put("activation_code", activationCode);

        Context context = new Context();
        context.setVariables(properties);

        helper.setFrom("akymltya44@gmail.com");
        helper.setTo(to);
        helper.setSubject(subject);

        String template = templateEngine.process(templateName, context);

        helper.setText(template, true);

        mailSender.send(mimeMessage);
    }

    @Async
    public void sendOrderInfoEmail(
            String to,
            String username,
            String orderNumber,
            String subject,
            EmailTemplateName emailTemplate,
            List<OrderItem> orderItems,
            Double totalAmount
    ) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    mimeMessage,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    UTF_8.name()
            );

            Map<String, Object> properties = new HashMap<>();
            properties.put("username", username);
            properties.put("orderNumber", orderNumber);
            properties.put("orderItems", orderItems);
            properties.put("totalAmount", totalAmount);

            Context context = new Context();
            context.setVariables(properties);

            helper.setFrom("akymltya44@gmail.com");
            helper.setTo(to);
            helper.setSubject(subject);

            String template = templateEngine.process(EmailTemplateName.SEND_ORDER_INFO.name(), context);
            helper.setText(template, true);

            // Embed images in the email content for each product when ı don't do this ı get an error that don't show images in the email
            for (OrderItem item : orderItems) {
                String imageUrl = item.getProduct().getImageUrl();
                if (imageUrl != null && !imageUrl.isEmpty()) {
                    try {
                        URL url = new URL(imageUrl);
                        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

                        // Reading the image data into a byte array for embedding
                        try (InputStream imageStream = url.openStream()) {
                            byte[] buffer = new byte[4096];
                            int bytesRead;
                            while ((bytesRead = imageStream.read(buffer)) != -1) {
                                outputStream.write(buffer, 0, bytesRead);
                            }
                        }

                        byte[] imageBytes = outputStream.toByteArray();
                        String contentId = "image" + item.getProduct().getId();
                        ByteArrayResource imageResource = new ByteArrayResource(imageBytes);

                        helper.addInline(contentId, imageResource, "image/jpeg");

                        properties.put("image" + item.getProduct().getId(), contentId);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }

            mailSender.send(mimeMessage);

        } catch (MessagingException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @Async
    public void sendResetPasswordEmail(
            String to,
            EmailTemplateName emailTemplate,
            String resetLink,
            String subject
    ) throws MessagingException {
        String templateName;
        if (emailTemplate == null) {
            templateName = "confirm-email";
        } else {
            templateName = emailTemplate.name();
        }
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                MULTIPART_MODE_MIXED,
                UTF_8.name()
        );
        Map<String, Object> properties = new HashMap<>();
        properties.put("resetLink", resetLink);


        Context context = new Context();
        context.setVariables(properties);

        helper.setFrom("akymltya44@gmail.com");
        helper.setTo(to);
        helper.setSubject(subject);

        String template = templateEngine.process(templateName, context);

        helper.setText(template, true);

        mailSender.send(mimeMessage);
    }


}





//    @Async
//    public void sendOrderInfoEmail(
//            String to,
//            String username,
//            String orderNumber,
//            String subject,
//            EmailTemplateName emailTemplate,
//            List<OrderItem> orderItems,
//            Double totalAmount
//    ) throws MessagingException {
//        MimeMessage mimeMessage = mailSender.createMimeMessage();
//        MimeMessageHelper helper = new MimeMessageHelper(
//                mimeMessage,
//                MULTIPART_MODE_MIXED,
//                UTF_8.name()
//        );
//        Map<String, Object> properties = new HashMap<>();
//        properties.put("username", username);
//        properties.put("orderNumber", orderNumber);
//        properties.put("orderItems", orderItems);
//        properties.put("totalAmount", totalAmount);
//
//
//        Context context = new Context();
//        context.setVariables(properties);
//
//        helper.setFrom("akymltya44@gmail.com");
//        helper.setTo(to);
//        helper.setSubject(subject);
//
//        String template = templateEngine.process(EmailTemplateName.SEND_ORDER_INFO.name(), context);
//
//        helper.setText(template, true);
//
//        for (OrderItem item : orderItems) {
//            System.out.println("Item image: " + item.getProduct().getImageUrl());
//        }
//
//        mailSender.send(mimeMessage);
//    }