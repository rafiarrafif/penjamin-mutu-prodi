/*
  Microsoft SQL Server initialization script
  Database: rsi_project

  Connection values based on DATABASE_URL:
  Server: localhost,1433
  Login: sa
  Password: KopiHitam_2026!
  Encryption: enabled
  Trust server certificate: enabled

  Generated from backend/db_structure.dbml.
  Application-supplied UNIQUEIDENTIFIER values are used for primary keys.
*/

USE [master];
GO

IF DB_ID(N'rsi_project') IS NULL
BEGIN
    CREATE DATABASE [rsi_project];
END;
GO

USE [rsi_project];
GO

IF OBJECT_ID(N'dbo._prisma_migrations', N'U') IS NOT NULL
BEGIN
    -- The script only creates application tables. It does not remove an existing Prisma migration history.
END;
GO

/* 1. Independent lookup and account tables */

IF OBJECT_ID(N'dbo.failed_login_logs', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[failed_login_logs]
    (
        [id]            UNIQUEIDENTIFIER NOT NULL,
        [email]         VARCHAR(255) NOT NULL,
        [name]          VARCHAR(255) NULL,
        [ip_address]    VARCHAR(45) NULL,
        [device_info]   VARCHAR(255) NULL,
        [browser_info]  VARCHAR(255) NULL,
        [attempt_at]    DATETIME2 NOT NULL,

        CONSTRAINT [PK_failed_login_logs]
            PRIMARY KEY ([id])
    );
END;
GO

IF OBJECT_ID(N'dbo.frequencies', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[frequencies]
    (
        [code]  VARCHAR(32) NOT NULL,
        [label] VARCHAR(225) NOT NULL,

        CONSTRAINT [PK_frequencies]
            PRIMARY KEY ([code])
    );
END;
GO

IF OBJECT_ID(N'dbo.accounts', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[accounts]
    (
        [id]               UNIQUEIDENTIFIER NOT NULL,
        [sub]              VARCHAR(255) NOT NULL,
        [fullname]         VARCHAR(255) NOT NULL,
        [email]            VARCHAR(255) NOT NULL,
        [profile_picture]  VARCHAR(255) NULL,
        [role]             VARCHAR(12) NOT NULL,
        [sex]              VARCHAR(6) NOT NULL,
        [phone_no]         VARCHAR(15) NULL,
        [address]          VARCHAR(255) NULL,
        [is_verfied]       BIT NOT NULL,
        [updated_at]       DATETIME2 NOT NULL,
        [created_at]       DATETIME2 NOT NULL,
        [deleted_at]       DATETIME2 NULL,

        CONSTRAINT [PK_accounts]
            PRIMARY KEY ([id]),
        CONSTRAINT [UQ_accounts_sub]
            UNIQUE ([sub]),
        CONSTRAINT [UQ_accounts_email]
            UNIQUE ([email]),
        CONSTRAINT [CK_accounts_role]
            CHECK ([role] IN ('admin', 'lecturer', 'verificator', 'director'))
    );
END;
GO

/* 2. Department and session tables */

IF OBJECT_ID(N'dbo.departments', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[departments]
    (
        [id]                 UNIQUEIDENTIFIER NOT NULL,
        [name]               VARCHAR(115) NOT NULL,
        [description]        VARCHAR(255) NULL,
        [account_id_creator] UNIQUEIDENTIFIER NOT NULL,
        [account_id_updater] UNIQUEIDENTIFIER NULL,
        [created_at]         DATETIME2 NOT NULL,
        [updated_at]         DATETIME2 NOT NULL,
        [deleted_at]         DATETIME2 NULL,

        CONSTRAINT [PK_departments]
            PRIMARY KEY ([id]),
        CONSTRAINT [FK_departments_creator_account]
            FOREIGN KEY ([account_id_creator])
            REFERENCES [dbo].[accounts] ([id]),
        CONSTRAINT [FK_departments_updater_account]
            FOREIGN KEY ([account_id_updater])
            REFERENCES [dbo].[accounts] ([id])
    );
END;
GO

IF OBJECT_ID(N'dbo.sessions', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[sessions]
    (
        [id]            UNIQUEIDENTIFIER NOT NULL,
        [account_id]    UNIQUEIDENTIFIER NOT NULL,
        [device_type]   VARCHAR(8) NOT NULL,
        [device_os]     VARCHAR(255) NULL,
        [browser]       VARCHAR(255) NULL,
        [ip_address]    VARCHAR(45) NULL,
        [access_token]  VARCHAR(375) NULL,
        [refresh_token] VARCHAR(375) NULL,
        [logged_in_at]  DATETIME2 NOT NULL,
        [revoked_at]    DATETIME2 NULL,

        CONSTRAINT [PK_sessions]
            PRIMARY KEY ([id]),
        CONSTRAINT [FK_sessions_account]
            FOREIGN KEY ([account_id])
            REFERENCES [dbo].[accounts] ([id]),
        CONSTRAINT [CK_sessions_device_type]
            CHECK ([device_type] IN ('mobile', 'tablet', 'tv', 'desktop'))
    );
END;
GO

IF OBJECT_ID(N'dbo.account_notification', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[account_notification]
    (
        [id]          UNIQUEIDENTIFIER NOT NULL,
        [account_id]  UNIQUEIDENTIFIER NOT NULL,
        [title]       VARCHAR(500) NOT NULL,
        [description] VARCHAR(500) NOT NULL,

        CONSTRAINT [PK_account_notification]
            PRIMARY KEY ([id]),
        CONSTRAINT [FK_account_notification_account]
            FOREIGN KEY ([account_id])
            REFERENCES [dbo].[accounts] ([id])
    );
END;
GO

IF OBJECT_ID(N'dbo.department_histories', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[department_histories]
    (
        [id]                 UNIQUEIDENTIFIER NOT NULL,
        [account_id]         UNIQUEIDENTIFIER NOT NULL,
        [department_id]      UNIQUEIDENTIFIER NOT NULL,
        [start_date]         DATE NOT NULL,
        [end_date]           DATE NULL,
        [account_id_assigner] UNIQUEIDENTIFIER NOT NULL,
        [created_at]         DATETIME2 NOT NULL,

        CONSTRAINT [PK_department_histories]
            PRIMARY KEY ([id]),
        CONSTRAINT [FK_department_histories_account]
            FOREIGN KEY ([account_id])
            REFERENCES [dbo].[accounts] ([id]),
        CONSTRAINT [FK_department_histories_department]
            FOREIGN KEY ([department_id])
            REFERENCES [dbo].[departments] ([id]),
        CONSTRAINT [FK_department_histories_assigner]
            FOREIGN KEY ([account_id_assigner])
            REFERENCES [dbo].[accounts] ([id])
    );
END;
GO

/* 3. Data category, requirement, period, and entry tables */

IF OBJECT_ID(N'dbo.data_categories', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[data_categories]
    (
        [id]   UNIQUEIDENTIFIER NOT NULL,
        [slug] VARCHAR(255) NOT NULL,
        [name] VARCHAR(255) NOT NULL,

        CONSTRAINT [PK_data_categories]
            PRIMARY KEY ([id])
    );

    CREATE INDEX [index_2]
        ON [dbo].[data_categories] ([slug]);
END;
GO

IF OBJECT_ID(N'dbo.data_requirements', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[data_requirements]
    (
        [data_category_id] UNIQUEIDENTIFIER NOT NULL,
        [id]               UNIQUEIDENTIFIER NOT NULL,
        [frequency_code]   VARCHAR(32) NOT NULL,
        [name]             VARCHAR(500) NOT NULL,

        CONSTRAINT [PK_data_requirements]
            PRIMARY KEY ([id]),
        CONSTRAINT [FK_data_requirements_category]
            FOREIGN KEY ([data_category_id])
            REFERENCES [dbo].[data_categories] ([id]),
        CONSTRAINT [FK_data_requirements_frequency]
            FOREIGN KEY ([frequency_code])
            REFERENCES [dbo].[frequencies] ([code])
    );
END;
GO

IF OBJECT_ID(N'dbo.periods', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[periods]
    (
        [id]             UNIQUEIDENTIFIER NOT NULL,
        [frequency_code] VARCHAR(32) NOT NULL,
        [label]          VARCHAR(64) NOT NULL,
        [year]           SMALLINT NOT NULL,
        [month]          SMALLINT NULL,
        [semester]       SMALLINT NULL,
        [start_date]     DATE NOT NULL,
        [end_date]       DATE NOT NULL,

        CONSTRAINT [PK_periods]
            PRIMARY KEY ([id]),
        CONSTRAINT [FK_periods_frequency]
            FOREIGN KEY ([frequency_code])
            REFERENCES [dbo].[frequencies] ([code])
    );
END;
GO

IF OBJECT_ID(N'dbo.data_entries', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[data_entries]
    (
        [data_requirement_id] UNIQUEIDENTIFIER NOT NULL,
        [id]                  UNIQUEIDENTIFIER NOT NULL,
        [period_id]           UNIQUEIDENTIFIER NOT NULL,
        [filename]            VARCHAR(255) NOT NULL,
        [filetype]            VARCHAR(12) NOT NULL,
        [file_size]           INT NOT NULL,
        [is_secret]           BIT NOT NULL,

        CONSTRAINT [PK_data_entries]
            PRIMARY KEY ([id]),
        CONSTRAINT [FK_data_entries_requirement]
            FOREIGN KEY ([data_requirement_id])
            REFERENCES [dbo].[data_requirements] ([id]),
        CONSTRAINT [FK_data_entries_period]
            FOREIGN KEY ([period_id])
            REFERENCES [dbo].[periods] ([id]),
        CONSTRAINT [CK_data_entries_filetype]
            CHECK ([filetype] IN
            (
                'pdf', 'docx', 'doc', 'txt', 'rtf', 'odt',
                'xlsx', 'xls', 'ods', 'csv', 'pptx', 'ppt', 'odp',
                'jpg', 'jpeg', 'png', 'zip', 'rar', '7z'
            ))
    );
END;
GO

IF OBJECT_ID(N'dbo.file_uploads', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[file_uploads]
    (
        [data_entry_id] UNIQUEIDENTIFIER NOT NULL,
        [blob]          VARCHAR(500) NOT NULL,

        CONSTRAINT [PK_file_uploads]
            PRIMARY KEY ([data_entry_id]),
        CONSTRAINT [FK_file_uploads_data_entry]
            FOREIGN KEY ([data_entry_id])
            REFERENCES [dbo].[data_entries] ([id])
    );
END;
GO

IF OBJECT_ID(N'dbo.department_pics', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[department_pics]
    (
        [department_id]      UNIQUEIDENTIFIER NOT NULL,
        [requirement_id]     UNIQUEIDENTIFIER NOT NULL,
        [account_id_assigner] UNIQUEIDENTIFIER NOT NULL,
        [created_at]         DATETIME2 NOT NULL,

        CONSTRAINT [PK_department_pics]
            PRIMARY KEY ([department_id], [requirement_id]),
        CONSTRAINT [FK_department_pics_department]
            FOREIGN KEY ([department_id])
            REFERENCES [dbo].[departments] ([id]),
        CONSTRAINT [FK_department_pics_requirement]
            FOREIGN KEY ([requirement_id])
            REFERENCES [dbo].[data_requirements] ([id]),
        CONSTRAINT [FK_department_pics_assigner]
            FOREIGN KEY ([account_id_assigner])
            REFERENCES [dbo].[accounts] ([id])
    );
END;
GO

/* 4. Submission and scoring tables */

IF OBJECT_ID(N'dbo.submissions', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[submissions]
    (
        [entry_id]           UNIQUEIDENTIFIER NOT NULL,
        [account_id_submiter] UNIQUEIDENTIFIER NOT NULL,
        [account_id_reviewer] UNIQUEIDENTIFIER NULL,
        [status]             VARCHAR(8) NOT NULL DEFAULT ('hold'),
        [reviewer_message]   VARCHAR(255) NULL,
        [reviewed_at]        DATETIME2 NULL,
        [created_at]         DATETIME2 NOT NULL,
        [updated_at]         DATETIME2 NOT NULL,
        [deleted_at]         DATETIME2 NULL,

        CONSTRAINT [PK_submissions]
            PRIMARY KEY ([entry_id]),
        CONSTRAINT [FK_submissions_entry]
            FOREIGN KEY ([entry_id])
            REFERENCES [dbo].[data_entries] ([id]),
        CONSTRAINT [FK_submissions_submitter]
            FOREIGN KEY ([account_id_submiter])
            REFERENCES [dbo].[accounts] ([id]),
        CONSTRAINT [FK_submissions_reviewer]
            FOREIGN KEY ([account_id_reviewer])
            REFERENCES [dbo].[accounts] ([id]),
        CONSTRAINT [CK_submissions_status]
            CHECK ([status] IN ('hold', 'accept', 'reject', 'revision'))
    );
END;
GO

IF OBJECT_ID(N'dbo.scoring_methods', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[scoring_methods]
    (
        [id]                 UNIQUEIDENTIFIER NOT NULL,
        [name]               VARCHAR(255) NOT NULL,
        [success_rate]       NUMERIC(5,2) NOT NULL,
        [pass_rate]          NUMERIC(5,2) NOT NULL,
        [account_id_creator] UNIQUEIDENTIFIER NOT NULL,
        [account_id_updater] UNIQUEIDENTIFIER NOT NULL,
        [created_at]         DATETIME2 NOT NULL,
        [update_at]          DATETIME2 NOT NULL,
        [deleted_at]         DATETIME2 NULL,

        CONSTRAINT [PK_scoring_methods]
            PRIMARY KEY ([id]),
        CONSTRAINT [FK_scoring_methods_creator]
            FOREIGN KEY ([account_id_creator])
            REFERENCES [dbo].[accounts] ([id]),
        CONSTRAINT [FK_scoring_methods_updater]
            FOREIGN KEY ([account_id_updater])
            REFERENCES [dbo].[accounts] ([id])
    );
END;
GO

IF OBJECT_ID(N'dbo.scoring_formula', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[scoring_formula]
    (
        [id]               UNIQUEIDENTIFIER NOT NULL,
        [scoring_method_id] UNIQUEIDENTIFIER NOT NULL,
        [attribute]        VARCHAR(255) NOT NULL,
        [attribute_type]   VARCHAR(10) NOT NULL,
        [description]      VARCHAR(400) NULL,
        [account_id_creator] UNIQUEIDENTIFIER NOT NULL,
        [account_id_updater] UNIQUEIDENTIFIER NOT NULL,
        [created_at]       DATETIME2 NOT NULL,
        [update_at]        DATETIME2 NOT NULL,
        [deleted_at]       DATETIME2 NULL,

        CONSTRAINT [PK_scoring_formula]
            PRIMARY KEY ([id]),
        CONSTRAINT [UQ_scoring_formula_attribute]
            UNIQUE ([attribute]),
        CONSTRAINT [FK_scoring_formula_method]
            FOREIGN KEY ([scoring_method_id])
            REFERENCES [dbo].[scoring_methods] ([id]),
        CONSTRAINT [FK_scoring_formula_creator]
            FOREIGN KEY ([account_id_creator])
            REFERENCES [dbo].[accounts] ([id]),
        CONSTRAINT [FK_scoring_formula_updater]
            FOREIGN KEY ([account_id_updater])
            REFERENCES [dbo].[accounts] ([id]),
        CONSTRAINT [CK_scoring_formula_attribute_type]
            CHECK ([attribute_type] IN ('variable', 'hasil'))
    );
END;
GO

IF OBJECT_ID(N'dbo.scoring_result', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[scoring_result]
    (
        [data_entry_id]     UNIQUEIDENTIFIER NOT NULL,
        [scoring_method_id] UNIQUEIDENTIFIER NOT NULL,
        [proof_link]        VARCHAR(255) NOT NULL,
        [period]            VARCHAR(255) NOT NULL,

        CONSTRAINT [PK_scoring_result]
            PRIMARY KEY ([data_entry_id], [scoring_method_id]),
        CONSTRAINT [FK_scoring_result_entry]
            FOREIGN KEY ([data_entry_id])
            REFERENCES [dbo].[data_entries] ([id]),
        CONSTRAINT [FK_scoring_result_method]
            FOREIGN KEY ([scoring_method_id])
            REFERENCES [dbo].[scoring_methods] ([id])
    );
END;
GO

/* 5. Audit log table */

IF OBJECT_ID(N'dbo.change_logs', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[change_logs]
    (
        [id]                UNIQUEIDENTIFIER NOT NULL,
        [session_id_related] UNIQUEIDENTIFIER NOT NULL,
        [related_module]    VARCHAR(155) NOT NULL,
        [module_name]       VARCHAR(155) NOT NULL,
        [action]            VARCHAR(8) NOT NULL,
        [description]       VARCHAR(500) NOT NULL,
        [created_at]        DATETIME2 NOT NULL,

        CONSTRAINT [PK_change_logs]
            PRIMARY KEY ([id]),
        CONSTRAINT [FK_change_logs_session]
            FOREIGN KEY ([session_id_related])
            REFERENCES [dbo].[sessions] ([id]),
        CONSTRAINT [CK_change_logs_action]
            CHECK ([action] IN ('add', 'edit', 'delete', 'purge'))
    );
END;
GO

PRINT N'Database rsi_project and application tables created successfully.';
