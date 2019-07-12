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
	tutorWorkScheduleReportWindow = new BrowserWindow(windowOptions(600, 800, false));
	tutorSubjectReportWindow = new BrowserWindow(windowOptions(600, 800, false));

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

ipcMain.on('toggle-print', () => {
	tutorWorkTrackReportWindow.webContents.print({}, (success) => {
		if (!success) {
			console.log('print unsuccessfully');
		}
	});
});
