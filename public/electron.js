const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const isDev = require('electron-is-dev');

const ipcMain = electron.ipcMain;

// Windows declaration
let mainWindow;

let tutorWorkTrackReportWindow;
let tutorWorkScheduleReportWindow;
let tutorSubjectReportWindow;
let tutorInfoReportWindow;

let subjectListReportWindow;
let subjectByTutorReportWindow;

let appointmentByTutorReportWindow;
let appointmentByStudentReportWindow;

const windowOptions = (width, height, show) => {
	return {
		width,
		height,
		resizable: false,
		show,
		webPreferences: {
			preload: __dirname + '/preload.js'
		}
	};
};

function createWindow() {
	mainWindow = new BrowserWindow(windowOptions(1200, 820, true));
	tutorWorkTrackReportWindow = new BrowserWindow(windowOptions(600, 800, false));
	tutorWorkScheduleReportWindow = new BrowserWindow(windowOptions(595, 842, false));
	tutorSubjectReportWindow = new BrowserWindow(windowOptions(595, 842, false));
	tutorInfoReportWindow = new BrowserWindow(windowOptions(595, 842, false));

	subjectListReportWindow = new BrowserWindow(windowOptions(595, 842, false));
	subjectByTutorReportWindow = new BrowserWindow(windowOptions(595, 842, false));

	appointmentByTutorReportWindow = new BrowserWindow(windowOptions(595, 842, false));
	appointmentByStudentReportWindow = new BrowserWindow(windowOptions(595, 842, false));

	mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
	tutorWorkTrackReportWindow.loadURL(
		isDev
			? 'http://localhost:3000/#/tutor-work-report'
			: `file://${path.join(__dirname, '../build/index.html#tutor-work-report')}`
	);
	tutorWorkScheduleReportWindow.loadURL(
		isDev
			? 'http://localhost:3000/#/tutor-schedule-report'
			: `file://${path.join(__dirname, '../build/index.html#tutor-schedule-report')}`
	);
	tutorSubjectReportWindow.loadURL(
		isDev
			? 'http://localhost:3000/#/tutor-subject-report'
			: `file://${path.join(__dirname, '../build/index.html#tutor-subject-report')}`
	);
	tutorInfoReportWindow.loadURL(
		isDev
			? 'http://localhost:3000/#/tutor-info-report'
			: `file://${path.join(__dirname, '../build/index.html#tutor-info-report')}`
	);

	subjectListReportWindow.loadURL(
		isDev
			? 'http://localhost:3000/#/subject-list-report'
			: `file://${path.join(__dirname, '../build/index.html#subject-list-report')}`
	);
	subjectByTutorReportWindow.loadURL(
		isDev
			? 'http://localhost:3000/#/subject-by-tutor-report'
			: `file://${path.join(__dirname, '../build/index.html#subject-by-tutor-report')}`
	);

	appointmentByTutorReportWindow.loadURL(
		isDev
			? 'http://localhost:3000/#/appointment-by-tutor-report'
			: `file://${path.join(__dirname, '../build/index.html#appointment-by-tutor-report')}`
	);
	appointmentByStudentReportWindow.loadURL(
		isDev
			? 'http://localhost:3000/#/appointment-by-student-report'
			: `file://${path.join(__dirname, '../build/index.html#appointment-by-student-report')}`
	);

	mainWindow.on('closed', () => (mainWindow = null));

	tutorWorkTrackReportWindow.on('close', (e) => {
		e.preventDefault();
		tutorWorkTrackReportWindow.hide();
	});

	tutorWorkScheduleReportWindow.on('close', (e) => {
		e.preventDefault();
		tutorWorkScheduleReportWindow.hide();
	});

	tutorSubjectReportWindow.on('close', (e) => {
		e.preventDefault();
		tutorSubjectReportWindow.hide();
	});

	tutorInfoReportWindow.on('close', (e) => {
		e.preventDefault();
		tutorInfoReportWindow.hide();
	});

	subjectListReportWindow.on('close', (e) => {
		e.preventDefault();
		subjectListReportWindow.hide();
	});

	subjectByTutorReportWindow.on('close', (e) => {
		e.preventDefault();
		subjectByTutorReportWindow.hide();
	});

	appointmentByTutorReportWindow.on('close', (e) => {
		e.preventDefault();
		appointmentByTutorReportWindow.hide();
	});

	appointmentByStudentReportWindow.on('close', (e) => {
		e.preventDefault();
		appointmentByStudentReportWindow.hide();
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});

ipcMain.on('toggle-work-report', (_, content) => {
	tutorWorkTrackReportWindow.show();
	tutorWorkTrackReportWindow.webContents.send('tutor-work-report', content);
});

ipcMain.on('toggle-schedule-report', (_, content) => {
	tutorWorkScheduleReportWindow.show();
	tutorWorkScheduleReportWindow.webContents.send('tutor-schedule-report', content);
});

ipcMain.on('toggle-subject-report', (_, content) => {
	tutorSubjectReportWindow.show();
	tutorSubjectReportWindow.webContents.send('tutor-subject-report', content);
});

ipcMain.on('toggle-info-report', (_, content) => {
	tutorInfoReportWindow.show();
	tutorInfoReportWindow.webContents.send('tutor-info-report', content);
});

ipcMain.on('toggle-subject-list-report', (_, content) => {
	subjectListReportWindow.show();
	subjectListReportWindow.webContents.send('subject-list-report', content);
});

ipcMain.on('toggle-subject-by-tutor-report', (_, content) => {
	subjectByTutorReportWindow.show();
	subjectByTutorReportWindow.webContents.send('subject-by-tutor-report', content);
});

ipcMain.on('toggle-appointment-by-tutor-report', (_, content) => {
	appointmentByTutorReportWindow.show();
	appointmentByTutorReportWindow.webContents.send('appointment-by-tutor-report', content);
});

ipcMain.on('toggle-appointment-by-student-report', (_, content) => {
	appointmentByStudentReportWindow.show();
	appointmentByStudentReportWindow.webContents.send('appointment-by-student-report', content);
});

ipcMain.on('toggle-print', () => {
	tutorWorkTrackReportWindow.webContents.print({}, (success) => {
		if (!success) {
			console.log('print unsuccessfully');
		}
	});
});
